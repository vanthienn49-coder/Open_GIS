import logging
import sys

def setup_logging():
    logger = logging.getLogger("webgis")
    logger.setLevel(logging.INFO)
    
    # Prevent duplicate logs if already configured
    if logger.handlers:
        return logger

    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )

    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    
    logger.addHandler(console_handler)
    return logger
