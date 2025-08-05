import crypto from 'crypto';

// Encryption key (in production, this should be stored securely)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'hakim-ai-secure-key-32-chars-long!';
const ALGORITHM = 'aes-256-gcm';

// Encrypt text data
export const encrypt = (text) => {
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(ALGORITHM, ENCRYPTION_KEY);
    cipher.setAutoPadding(true);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    // Return IV + AuthTag + EncryptedData
    return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Encryption failed');
  }
};

// Decrypt text data
export const decrypt = (encryptedData) => {
  try {
    const parts = encryptedData.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];
    
    const decipher = crypto.createDecipher(ALGORITHM, ENCRYPTION_KEY);
    decipher.setAuthTag(authTag);
    decipher.setAutoPadding(true);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Decryption failed');
  }
};

// Hash sensitive data for comparison (one-way)
export const hash = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

// Generate secure random string
export const generateSecureId = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Validate encryption key
export const validateEncryptionKey = () => {
  if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length < 32) {
    console.warn('⚠️ Warning: Encryption key is too short or missing. Using default key.');
  }
}; 