import os
import requests
import logging
from datetime import datetime

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    filename='/app/logs/wake_service.log',
    filemode='a'
)

def wake_up_service():
    app_url = os.environ.get('APP_URL')
    
    if not app_url:
        logging.error("APP_URL environment variable is not set")
        return
    
    try:
        response = requests.get(app_url, timeout=10)
        logging.info(f"Wake-up request sent to {app_url} - Status: {response.status_code}")
    except Exception as e:
        logging.error(f"Error sending wake-up request: {str(e)}")

if __name__ == "__main__":
    logging.info(f"Wake-up script started at {datetime.now()}")
    wake_up_service()
