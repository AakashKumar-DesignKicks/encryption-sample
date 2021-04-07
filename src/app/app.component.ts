import { Component, OnInit } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import JSEncrypt from 'jsencrypt';
import * as forge from 'node-forge';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'encryption';
  plainText: string;
  encryptText: string;
  encPassword: string;
  decPassword: string;
  conversionEncryptOutput: string;
  conversionDecryptOutput: string;

  backendResponse = 'b8E6EMy/ClcgH1Z4O0RffO7mRgLzajn4XqEwo3AreNmpiZkpTyZIl46cTTVeGcaG8xldTPGDJeRbHW0cwwWdwuvWO0eYDRYMOEZVCAdqNlRYgEqOUqmaZSXWbBGJVNvDoLLFmvZIVPNGTE9OArNwsjv3yK8j+mIwK0aDLVKVhw8=';

  originalPublicKey: string;
  originalPrivateKey: string;
  publicKey: string;
  privateKey: string;

  constructor() {
  }

  ngOnInit(): void {

    this.originalPublicKey = `-----BEGIN PUBLIC KEY-----
    MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwdE3VflMkDaSqfr4LKKW
    9Pc8gkxkacvs3LDYKgYRy/zOgI0bJJyNALKvHy8ELt0NqofYzTmOONsQPg3kytiZ
    rjJcnXMnEMqGt0za7THpPUJr3t1MvTnp5mIR6+Pb1/ZXBpwk01/utFeeoKlG9aS7
    8red1fz2O6Qg/hYJUcaFeqnCBjyI6FGpDH/t0zEMvrEAx1XQfQ0iQmJZAdK3uSrz
    429qEQuBnAD8v4Qf9ECyAQoimuzJra89Y+/kBn3l4igCE3TRhYImBUTDLbg8kTXp
    +ttw1sX93tNH3pF1iFk0QlGSD5HVsSMWFmMpHtv9ckZQC22WlM6ZMtzmu2q8uzHw
    FQIDAQAB
    -----END PUBLIC KEY-----`;

    this.originalPrivateKey = `-----BEGIN RSA PRIVATE KEY-----
    MIIEowIBAAKCAQEAwdE3VflMkDaSqfr4LKKW9Pc8gkxkacvs3LDYKgYRy/zOgI0b
    JJyNALKvHy8ELt0NqofYzTmOONsQPg3kytiZrjJcnXMnEMqGt0za7THpPUJr3t1M
    vTnp5mIR6+Pb1/ZXBpwk01/utFeeoKlG9aS78red1fz2O6Qg/hYJUcaFeqnCBjyI
    6FGpDH/t0zEMvrEAx1XQfQ0iQmJZAdK3uSrz429qEQuBnAD8v4Qf9ECyAQoimuzJ
    ra89Y+/kBn3l4igCE3TRhYImBUTDLbg8kTXp+ttw1sX93tNH3pF1iFk0QlGSD5HV
    sSMWFmMpHtv9ckZQC22WlM6ZMtzmu2q8uzHwFQIDAQABAoIBAQCLNlw5u4wb1ab4
    wtQ5Mzucjmz+5iIFv7zNM5TAcoWb8GTe/vttC6lXxAB3NI0boBlt0I+PsPSPsAF1
    oQMiE/wmm/Pb/9cif2XOCT0CvCPcpXXXqTqyfAOeP/jBZ3QEJeOSUts8nB5XmMvO
    eGgIjp+VEgAjsMOoSRaNioR9IUvEsyP3O9SuJ+SR9eSw9zQFsMDV48j/D6RJUZnl
    TRYjesQy9etbwFpOlkzj12VPyTekxNVzMyBSeTGxP5977c9qYYKmDbFmC7Bz63RD
    h4dBroMhxizZwblYGWS2stuuFjxcznt/Jc9z1lKalqidTSXhFW+QP+GQuTycb3kU
    UCsevjpBAoGBAOeTHRsEHLjiup8Vz2AUXilP2UobbSI3vQInKtNQlb3/hvYKz1dx
    +kkHxB+x+m4jRUCZyOr02fV1mqCxWGyeqrXkPqnDKSgSgAYV7Wesz/ZxqOT4AYQf
    SXtzPfruc6CxdyFEYaJXqlZGLvYzIj6vXqNlJl7vKMsEHEOP96htoD5FAoGBANZC
    l4kz9Q4hHD9DUW4eiuiHYR8j7F6C9vv2m+5NouPFwdE+vyGKDEumBPbLjr7IwhHr
    8vnuq4vMoTuiYsXlAPXNyXCj3BS7Uy3hE/1XcU7Ag8liRPY2JRpSwgW97/CDPIk/
    IIYiWB9ElVqovLPgv74Qm0uim9RiVx/7NbzYAC+RAoGAJ4aSpzPSezQnylN8q9eO
    ItsAKYf43qhI2H867gqJJH7i2EgMD87ie2iZ7xb/uaDHhzk4c/IK6byDAf6DKzcB
    yD4G/A7VjYNq2p8PgGycqmHIBBzYlWaJskp/P79HeRwRS1pSl9UCu+sKxPcBV1Wz
    f4waOoXznoM7F8UQ7myXt0kCgYAIxy+oKl3G12pt2Rcz+MJeJnW/LdyYPqtZxU+8
    Iqgixs5bAUQZXquESef4KHzPqi/xRgZtYO7cSmTsqYl8bBZu+6BeIgh5PPd6cLc9
    8OAuhsqfbIxAvhUlD/DtBUwYQXgwc0qk1DFiDpBD55fbksCoS8vg/Gd/+wtwvv0D
    oKHZUQKBgDm5SzZkDQSTvGK1OEuhzFmaH3L7QDN0x4qxK33JqIH92kQH2IEWF0ns
    t12g1YLJ+Shr4dXMgigb7wvAXMn0ZA77/pG0Et5RELccGqOq5IHAdjEsUJxOWs0W
    ddnD0LyhnYDb7CJAoHtEtkJaOmtVtu41g3wVpCgY+MMtD1NGwn9D
    -----END RSA PRIVATE KEY-----`;

    this.publicKey = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwdE3VflMkDaSqfr4LKKW
    9Pc8gkxkacvs3LDYKgYRy/zOgI0bJJyNALKvHy8ELt0NqofYzTmOONsQPg3kytiZ
    rjJcnXMnEMqGt0za7THpPUJr3t1MvTnp5mIR6+Pb1/ZXBpwk01/utFeeoKlG9aS7
    8red1fz2O6Qg/hYJUcaFeqnCBjyI6FGpDH/t0zEMvrEAx1XQfQ0iQmJZAdK3uSrz
    429qEQuBnAD8v4Qf9ECyAQoimuzJra89Y+/kBn3l4igCE3TRhYImBUTDLbg8kTXp
    +ttw1sX93tNH3pF1iFk0QlGSD5HVsSMWFmMpHtv9ckZQC22WlM6ZMtzmu2q8uzHw
    FQIDAQAB`;

    this.privateKey = `MIIEowIBAAKCAQEAwdE3VflMkDaSqfr4LKKW9Pc8gkxkacvs3LDYKgYRy/zOgI0b
    JJyNALKvHy8ELt0NqofYzTmOONsQPg3kytiZrjJcnXMnEMqGt0za7THpPUJr3t1M
    vTnp5mIR6+Pb1/ZXBpwk01/utFeeoKlG9aS78red1fz2O6Qg/hYJUcaFeqnCBjyI
    6FGpDH/t0zEMvrEAx1XQfQ0iQmJZAdK3uSrz429qEQuBnAD8v4Qf9ECyAQoimuzJ
    ra89Y+/kBn3l4igCE3TRhYImBUTDLbg8kTXp+ttw1sX93tNH3pF1iFk0QlGSD5HV
    sSMWFmMpHtv9ckZQC22WlM6ZMtzmu2q8uzHwFQIDAQABAoIBAQCLNlw5u4wb1ab4
    wtQ5Mzucjmz+5iIFv7zNM5TAcoWb8GTe/vttC6lXxAB3NI0boBlt0I+PsPSPsAF1
    oQMiE/wmm/Pb/9cif2XOCT0CvCPcpXXXqTqyfAOeP/jBZ3QEJeOSUts8nB5XmMvO
    eGgIjp+VEgAjsMOoSRaNioR9IUvEsyP3O9SuJ+SR9eSw9zQFsMDV48j/D6RJUZnl
    TRYjesQy9etbwFpOlkzj12VPyTekxNVzMyBSeTGxP5977c9qYYKmDbFmC7Bz63RD
    h4dBroMhxizZwblYGWS2stuuFjxcznt/Jc9z1lKalqidTSXhFW+QP+GQuTycb3kU
    UCsevjpBAoGBAOeTHRsEHLjiup8Vz2AUXilP2UobbSI3vQInKtNQlb3/hvYKz1dx
    +kkHxB+x+m4jRUCZyOr02fV1mqCxWGyeqrXkPqnDKSgSgAYV7Wesz/ZxqOT4AYQf
    SXtzPfruc6CxdyFEYaJXqlZGLvYzIj6vXqNlJl7vKMsEHEOP96htoD5FAoGBANZC
    l4kz9Q4hHD9DUW4eiuiHYR8j7F6C9vv2m+5NouPFwdE+vyGKDEumBPbLjr7IwhHr
    8vnuq4vMoTuiYsXlAPXNyXCj3BS7Uy3hE/1XcU7Ag8liRPY2JRpSwgW97/CDPIk/
    IIYiWB9ElVqovLPgv74Qm0uim9RiVx/7NbzYAC+RAoGAJ4aSpzPSezQnylN8q9eO
    ItsAKYf43qhI2H867gqJJH7i2EgMD87ie2iZ7xb/uaDHhzk4c/IK6byDAf6DKzcB
    yD4G/A7VjYNq2p8PgGycqmHIBBzYlWaJskp/P79HeRwRS1pSl9UCu+sKxPcBV1Wz
    f4waOoXznoM7F8UQ7myXt0kCgYAIxy+oKl3G12pt2Rcz+MJeJnW/LdyYPqtZxU+8
    Iqgixs5bAUQZXquESef4KHzPqi/xRgZtYO7cSmTsqYl8bBZu+6BeIgh5PPd6cLc9
    8OAuhsqfbIxAvhUlD/DtBUwYQXgwc0qk1DFiDpBD55fbksCoS8vg/Gd/+wtwvv0D
    oKHZUQKBgDm5SzZkDQSTvGK1OEuhzFmaH3L7QDN0x4qxK33JqIH92kQH2IEWF0ns
    t12g1YLJ+Shr4dXMgigb7wvAXMn0ZA77/pG0Et5RELccGqOq5IHAdjEsUJxOWs0W
    ddnD0LyhnYDb7CJAoHtEtkJaOmtVtu41g3wVpCgY+MMtD1NGwn9D`;

    this.checkRSA();

  }

  private checkRSA(): void {
    const encrypt = new JSEncrypt({default_key_size: '2048'});
    encrypt.setPublicKey(this.originalPublicKey);
    console.log('encrypt', encrypt);
    const encrypted = encrypt.encrypt(this.backendResponse);

    console.log('this.backendResponse', this.backendResponse);
    console.log('encrypted', encrypted);

    const decrypt = new JSEncrypt({default_key_size: '2048'});
    decrypt.setPrivateKey(this.originalPrivateKey);
    console.log('decrypt', decrypt);

    const decrypted = decrypt.decrypt(encrypted.toString());
    console.log('decrypted', decrypted);

    console.log('is Decrypted same as original key?', this.backendResponse.toString().trim() === decrypted.toString().trim());


    // Code which is working for generating RSA public private keys

    // const rsa = forge.pki.rsa;
    // const keypair = rsa.generateKeyPair({bits: 2048, e: 0x10001});
    // const publicKey = forge.pki.publicKeyToPem(keypair.publicKey);
    // const privatekey = forge.pki.privateKeyToPem(keypair.privateKey);

  }

  convertText(conversion: string): void {
      if (conversion === 'encrypt') {
        this.encrypWay2();
      }
      else {
        this.decryptWay3();
    }
  }

  /**
   * @description Basic Encryption
   */
  private encrypWay1(): void {
    this.conversionEncryptOutput = CryptoJS.AES.encrypt(this.plainText.trim(), this.encPassword.trim()).toString();
  }

  /**
   * @description Basic Decryption
   */
  private decryptWay1(): void {
    this.conversionDecryptOutput = CryptoJS.AES.decrypt(this.encryptText.trim(), this.decPassword.trim()).toString(CryptoJS.enc.Utf8);
  }

  /**
   * @description This is as per medium.com article
   * Link - https://sstarx.medium.com/encryption-and-decryption-in-angular-asp-net-core-application-1f55bfa3d8bd
   * WORKS
   */
  private encrypWay2(): void {
    // WORKS
    const salt = CryptoJS.lib.WordArray.random(128 / 8);
    const encryptSecretKey = this.encPassword.trim();
    const keySize = 256;

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

    // salt, iv will be hex 32 in length
    // append them to the ciphertext for use  in decryption
    const transitmessage = salt.toString() + ivParam.toString() + encrypted.toString();

    this.conversionEncryptOutput = transitmessage;
  }

  /**
   * @description This is as per medium.com article
   * Link - https://sstarx.medium.com/encryption-and-decryption-in-angular-asp-net-core-application-1f55bfa3d8bd
   * WORKS
   */
  private decryptWay2(): void {
    // WORKS
    const keySize = 256;

    const salt = CryptoJS.enc.Hex.parse(this.encryptText.substr(0, 32));
    const ivParam = CryptoJS.enc.Hex.parse(this.encryptText.substr(32, 32));
    const encrypted = this.encryptText.substring(64);

    const key = CryptoJS.PBKDF2(this.decPassword.trim(), salt, {
      keySize: keySize / 32,
      iterations: 100
    });

    const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
      iv: ivParam,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    });

    this.conversionDecryptOutput = decrypted.toString(CryptoJS.enc.Utf8);

  }

  /**
   * @description New code after discussion with Mayank
   */
  private decryptWay3(): void {
    const encryptedContent = this.backendResponse;

    const parsedEncryptedContent =  atob(encryptedContent);
    const array =  Uint8Array.from(parsedEncryptedContent, b => b.charCodeAt(0));

    const AESKey = array.slice(0, 32);
    const AESKeyBase64 = btoa(String.fromCharCode(...AESKey));

    const parsedKey = CryptoJS.enc.Base64.parse(AESKeyBase64);

    const AESIV = array.slice(32, 48);
    const AESIVBase64 = btoa(String.fromCharCode(...AESIV));
    const parsedIV = CryptoJS.enc.Base64.parse(AESIVBase64);

    const AESContent = array.slice(48, array.length);
    const AESContentBase64 = btoa(String.fromCharCode(...AESContent));

    const decrypted = CryptoJS.AES.decrypt(AESContentBase64, parsedKey, {
        iv: parsedIV,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
    }).toString(CryptoJS.enc.Utf8);

    this.conversionDecryptOutput = decrypted;
  }

}
