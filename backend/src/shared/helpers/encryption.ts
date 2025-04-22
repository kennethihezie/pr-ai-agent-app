import * as bcrypt from 'bcrypt';
import { constants, privateDecrypt, publicEncrypt } from 'crypto';
import { config } from 'src/common/config/config';
import AppError from './app-error';
import { ErrorCode } from '../enums/error-codes.enum';

export class Encryption {
    static async hashData(data: string, saltOrRounds: number = 10): Promise<string> {
        const hash = await bcrypt.hash(data, saltOrRounds);
        return hash
    }

    static async verifyData(existingData: string, incomingData: string): Promise<boolean> {
        const isMatch = await bcrypt.compare(incomingData, existingData);
        return isMatch
    }

    static decryptData(encryptedData: string) {
        try {
            const buffer = Buffer.from(encryptedData, 'base64');
            const decrypted = privateDecrypt(
                {
                    key: config.crypto.privateKey,
                    padding: constants.RSA_PKCS1_OAEP_PADDING,
                    oaepHash: 'sha256',
                },
                buffer,
            );
            return decrypted.toString('utf8');
        } catch (error) {
            console.error(error);
            throw new AppError(ErrorCode['0002'], 'Invalid or malformed data')
        }
    }

    static encryptData(data: string) {
        const buffer = Buffer.from(data, 'utf8');
        const encrypted = publicEncrypt(
            {
                key: config.crypto.publicKey,
                padding: constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: 'sha256',
            },
            buffer,
        );
        return encrypted.toString('base64');
    }
}