import sqlite3
import logging
from config import DATABASE_URL

logger = logging.getLogger(__name__)

def get_db_connection():
    db_path = DATABASE_URL.replace("sqlite:///", "")
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

class Database:
    def __init__(self, connection):
        self.connection = connection
        self.cursor = self.connection.cursor()
    
    def execute_query(self, query, params=None):
        try:
            if params:
                self.cursor.execute(query, params)
            else:
                self.cursor.execute(query)
            
            self.connection.commit()
            return self.cursor.fetchall()
        except Exception as e:
            logger.error(f"Query execution failed: {e}")
            if self.connection:
                self.connection.rollback()
            raise
    
    def execute_insert(self, query, params=None):
        try:
            if params:
                self.cursor.execute(query, params)
            else:
                self.cursor.execute(query)
            
            self.connection.commit()
            return self.cursor.fetchone()
        except Exception as e:
            logger.error(f"Insert execution failed: {e}")
            if self.connection:
                self.connection.rollback()
            raise
