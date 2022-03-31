"""empty message

Revision ID: 1d7d69a9cfb7
Revises: 05d341c65f3f
Create Date: 2022-03-28 22:05:36.458785

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1d7d69a9cfb7'
down_revision = '05d341c65f3f'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('instructor', sa.Column('maxLoad', sa.Integer(), nullable=False))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('instructor', 'maxLoad')
    # ### end Alembic commands ###