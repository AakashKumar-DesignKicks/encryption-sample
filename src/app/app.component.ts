import { Component } from '@angular/core';

import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'encryption';
  plainText: string;
  encryptText: string;
  encPassword: string;
  decPassword: string;
  conversionEncryptOutput: string;
  conversionDecryptOutput: string;

  constructor() {
  }

  convertText(conversion: string): void {
      if (conversion === 'encrypt') {
        this.encrypWay1();
      }
      else {
        this.decryptWay1();
    }
  }

  private encrypWay1(): void {
    this.conversionEncryptOutput = CryptoJS.AES.encrypt(this.plainText.trim(), this.encPassword.trim()).toString();
  }

  private decryptWay1(): void {
    this.conversionDecryptOutput = CryptoJS.AES.decrypt(this.encryptText.trim(), this.decPassword.trim()).toString(CryptoJS.enc.Utf8);
  }

  /**
   * @description This is as per medium.com article
   * Link - https://sstarx.medium.com/encryption-and-decryption-in-angular-asp-net-core-application-1f55bfa3d8bd
   * WORKS
   */
  private encrypWay2(): void {
    const encryptSecretKey = this.encPassword.trim();
    const keySize = 256;
    const salt = CryptoJS.lib.WordArray.random(16);
    const key = CryptoJS.PBKDF2(encryptSecretKey, salt, {
        keySize: keySize / 32,
        iterations: 100
    });
    const ivParam = CryptoJS.lib.WordArray.random(128 / 8);

    const encrypted = CryptoJS.AES.encrypt(this.plainText.trim(), key, {
      iv: ivParam,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    });

    const result = CryptoJS.enc.Base64.stringify(salt.concat(ivParam).concat(encrypted.ciphertext));

    this.conversionEncryptOutput = result;
  }

  /**
   * @description This is as per medium.com article
   * Link - https://sstarx.medium.com/encryption-and-decryption-in-angular-asp-net-core-application-1f55bfa3d8bd
   * DOES NOT WORK
   */
  private decryptWay2(): void {
    const keyPass = this.decPassword.trim();

    const keySize = 256;
    const salt = CryptoJS.lib.WordArray.random(16);
    const key = CryptoJS.PBKDF2(keyPass, salt, {
        keySize: keySize / 32,
        iterations: 100
    });
    const ivParam = CryptoJS.lib.WordArray.random(128 / 8);


    // const key = CryptoJS.enc.Utf8.parse(keyPass);
    // const ivParam = CryptoJS.lib.WordArray.create([0x00, 0x00, 0x00, 0x00]);

    const decrypted = CryptoJS.AES.decrypt(this.encryptText.trim(), key, {
      iv: ivParam,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    });

    this.conversionDecryptOutput = decrypted.toString(CryptoJS.enc.Utf8);

  }

}
