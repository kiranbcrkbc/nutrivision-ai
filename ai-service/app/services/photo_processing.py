"""Bound CPU/memory-heavy photo work without blocking the HTTP event loop."""
import threading
from starlette.concurrency import run_in_threadpool

_photo_lock = threading.Lock()


async def process_photo(function, *args):
    def bounded_work():
        # One decoded image / ONNX inference at a time on the small host.
        with _photo_lock:
            return function(*args)
    return await run_in_threadpool(bounded_work)
