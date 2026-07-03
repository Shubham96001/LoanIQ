from pathlib import Path
from uuid import uuid4

from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from fastapi import HTTPException, UploadFile

from ..config.settings import AES_KEY_HEX, ALLOWED_MIMETYPES, MAX_FILE_BYTES, UPLOAD_DIR


def _aes_key() -> bytes:
    key = bytes.fromhex(AES_KEY_HEX)
    if len(key) != 32:
        raise RuntimeError("AES_KEY_HEX must be a 64-character hex string")
    return key


async def encrypt_upload(file: UploadFile, pipeline_id: str) -> tuple[Path, int]:
    if file.content_type not in ALLOWED_MIMETYPES:
        raise HTTPException(status_code=415, detail="unsupported document type")

    data = await file.read()
    if len(data) > MAX_FILE_BYTES:
        raise HTTPException(status_code=413, detail="file exceeds 10 MB limit")

    nonce = uuid4().bytes[:12]
    encrypted = nonce + AESGCM(_aes_key()).encrypt(nonce, data, None)
    target_dir = UPLOAD_DIR / pipeline_id
    target_dir.mkdir(parents=True, exist_ok=True)
    suffix = Path(file.filename or "upload.bin").suffix
    target = target_dir / f"{uuid4().hex}{suffix}.enc"
    target.write_bytes(encrypted)
    return target, len(data)


def decrypt_file(path: str | Path) -> bytes:
    payload = Path(path).read_bytes()
    nonce, encrypted = payload[:12], payload[12:]
    return AESGCM(_aes_key()).decrypt(nonce, encrypted, None)
