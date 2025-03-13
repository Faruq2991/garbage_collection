"""Add request_number to GarbageRequest

Revision ID: 0dcacb0caa5b
Revises: 454acdbaebc1
Create Date: 2025-03-13 16:16:42.941988

"""
from typing import Sequence, Union
import logging

from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import text, table, column
import uuid


# revision identifiers, used by Alembic.
revision: str = '0dcacb0caa5b'
down_revision: Union[str, None] = '454acdbaebc1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# Set up logging
logging.basicConfig()
logger = logging.getLogger('alembic.migration')
logger.setLevel(logging.INFO)


def upgrade() -> None:
    connection = op.get_bind()
    
    # Check the current state of the table
    inspector = sa.inspect(connection)
    columns = [col['name'] for col in inspector.get_columns('garbage_requests')]
    indexes = inspector.get_indexes('garbage_requests')
    
    # Check if the column exists
    column_exists = 'request_number' in columns
    logger.info(f"Column 'request_number' exists: {column_exists}")
    
    # Check if the index exists
    index_exists = any(idx['name'] == 'ix_garbage_requests_request_number' for idx in indexes)
    logger.info(f"Index 'ix_garbage_requests_request_number' exists: {index_exists}")
    
    # Part 1: Ensure the column exists
    if not column_exists:
        logger.info("Adding 'request_number' column")
        with op.batch_alter_table('garbage_requests', recreate='always') as batch_op:
            batch_op.add_column(sa.Column('request_number', sa.String(), nullable=True))
    
    # Part 2: Ensure all records have unique values
    # First check if we have any duplicates
    has_duplicates = False
    if column_exists:
        result = connection.execute(
            text("""
                SELECT request_number, COUNT(*) as count 
                FROM garbage_requests 
                GROUP BY request_number 
                HAVING count > 1 OR request_number IS NULL
            """)
        )
        duplicates = result.fetchall()
        has_duplicates = len(duplicates) > 0
        logger.info(f"Duplicate or NULL values found: {has_duplicates}")
        
        if has_duplicates:
            # Get all records
            logger.info("Updating records with unique request numbers")
            result = connection.execute(text("SELECT id FROM garbage_requests"))
            records = result.fetchall()
            
            # Update each record with a guaranteed unique request number
            for row in records:
                unique_req_number = f"REQ-{uuid.uuid4().hex[:8].upper()}"
                connection.execute(
                    text("UPDATE garbage_requests SET request_number = :req_num WHERE id = :id"),
                    {"req_num": unique_req_number, "id": row[0]}
                )
    
    # Part 3: Make the column NOT NULL
    if column_exists and not has_duplicates:
        logger.info("Making 'request_number' column NOT NULL")
        with op.batch_alter_table('garbage_requests', recreate='always') as batch_op:
            batch_op.alter_column('request_number', nullable=False)
    
    # Part 4: Create the unique index if it doesn't exist
    if column_exists and not index_exists and not has_duplicates:
        logger.info("Creating unique index on 'request_number'")
        op.create_index(op.f('ix_garbage_requests_request_number'), 'garbage_requests', ['request_number'], unique=True)


def downgrade() -> None:
    connection = op.get_bind()
    inspector = sa.inspect(connection)
    
    # Check if index exists before trying to drop it
    indexes = inspector.get_indexes('garbage_requests')
    index_exists = any(idx['name'] == 'ix_garbage_requests_request_number' for idx in indexes)
    
    if index_exists:
        op.drop_index(op.f('ix_garbage_requests_request_number'), table_name='garbage_requests')
    
    # Check if column exists before trying to drop it
    columns = [col['name'] for col in inspector.get_columns('garbage_requests')]
    if 'request_number' in columns:
        with op.batch_alter_table('garbage_requests', recreate='always') as batch_op:
            batch_op.drop_column('request_number')