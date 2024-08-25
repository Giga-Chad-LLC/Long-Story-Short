from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.backends import default_backend
import os
import base64
import secrets

def encrypt_token(token: str, encryption_key: str) -> str:
    # Convert the key to bytes; AES requires a 16, 24, or 32-byte key for 128, 192, or 256-bit encryption
    key_bytes = encryption_key.encode()

    # Ensure the key length is valid (16 bytes for AES-128, 32 bytes for AES-256)
    if len(key_bytes) not in (16, 24, 32):
        raise ValueError(f"Invalid encryption key length. It must be 16, 24, or 32 bytes long, got {len(key_bytes)}.")

    # Generate a random 16-byte IV
    iv = secrets.token_bytes(16)

    # Create an AES Cipher object with the key and IV
    cipher = Cipher(algorithms.AES(key_bytes), modes.CBC(iv), backend=default_backend())
    encryptor = cipher.encryptor()

    # Pad the token to be multiple of block size (16 bytes for AES)
    padder = padding.PKCS7(algorithms.AES.block_size).padder()
    padded_token = padder.update(token.encode()) + padder.finalize()

    # Encrypt the padded token
    encrypted_token = encryptor.update(padded_token) + encryptor.finalize()

    # Encode the IV and the encrypted token in base64 to safely transmit as a string
    iv_b64 = base64.b64encode(iv).decode('utf-8')
    encrypted_token_b64 = base64.b64encode(encrypted_token).decode('utf-8')

    # Return the IV and encrypted token, concatenated or formatted as needed
    return {
      "iv": iv_b64,
      "encrypted_token": encrypted_token_b64
    }


def decrypt_token(iv: str, encrypted_token: str, encryption_key: str) -> str:
    # Convert the key to bytes; AES requires a 16, 24, or 32-byte key for 128, 192, or 256-bit encryption
    key_bytes = encryption_key.encode()

    # Ensure the key length is valid (16 bytes for AES-128, 24 bytes for AES-192, 32 bytes for AES-256)
    if len(key_bytes) not in (16, 24, 32):
        raise ValueError(f"Invalid encryption key length. It must be 16, 24, or 32 bytes long, got {len(key_bytes)}.")

    # Decode the IV and the encrypted token from base64
    iv_bytes = base64.b64decode(iv)
    encrypted_token_bytes = base64.b64decode(encrypted_token)

    # Create an AES Cipher object with the key and IV for decryption
    cipher = Cipher(algorithms.AES(key_bytes), modes.CBC(iv_bytes), backend=default_backend())
    decryptor = cipher.decryptor()

    # Decrypt the encrypted token
    padded_token = decryptor.update(encrypted_token_bytes) + decryptor.finalize()

    # Unpad the decrypted token to remove padding added during encryption
    unpadder = padding.PKCS7(algorithms.AES.block_size).unpadder()
    decrypted_token = unpadder.update(padded_token) + unpadder.finalize()

    return decrypted_token.decode('utf-8')
