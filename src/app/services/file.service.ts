import { Injectable, ElementRef } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { NgxImageCompressService } from 'ngx-image-compress';
import { UtilitiesService } from './utilities.service';


@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private storage: AngularFireStorage,
    private imageCompress: NgxImageCompressService,
    public utilities: UtilitiesService) { }

  compressFile(image: string, or: number, fileSize): Promise<string> {
    let qua = 25
    if (fileSize > 2 && fileSize < 10) {
      qua = 75
    } else if (fileSize > 2 && fileSize < 10) {
      qua = 50
    }
    return new Promise((res, rej) => {
      this.imageCompress.compressFile(image, or, 50, qua).then(result => res(result));
    })
  }
  uploadBlobFile(blob: any, conversacion: string, mensaje: string, usuario?: string, terapeuta?: string): Promise<string> {
    return new Promise(async (res, rej) => {
      const fileRef = this.storage.ref("audios" + "/" + conversacion + "/" + mensaje + "." + "wav");
      let meta: firebase.storage.SettableMetadata = { customMetadata: { usuario, terapeuta } }
      let snapshot = await fileRef.put(blob, meta)
      snapshot.task.snapshot.ref.getDownloadURL().then((down: string) => {
        res(down)
      })
    })
  }
  async uploadFile(file: any, tipo: number, folder: string, name?: string, extension?: string): Promise<string> {
    if (file.type === "video/mp4") {
      console.log("IS VIDEO")
      tipo = 4;
    }
    //let l: HTMLIonLoadingElement = await this.utilities.createLoading();
    switch (tipo) {
      case 1: // PDF, XLSX, TXT
        break;
      case 2: // Nota de voz
        extension = "mp3"
        break;
      case 3:
        extension = "jpg"
        break;
      case 4:
        extension = "mp4"
        break;
      default:
        break;
    }
    return new Promise(async (res, rej) => {
      let fileSize = file.size / 1024 / 1024;
      if (tipo === 3 && file.size / 1024 / 1024 > 20) {
        //l.dismiss()
        rej("Es un archivo demasiado grande")
        return;
      }
      const fileRef = this.storage.ref(folder + "/" + name + "." + extension);
      let task: AngularFireUploadTask;

      if (tipo === 3) {
        let or = await this.getOrientation(file);
        let base64 = await this.getBase64(file, or);
        if (fileSize > 2)
          base64 = await this.compressFile(base64, or, fileSize)

        if (base64.indexOf("data:image") !== -1)
          task = fileRef.putString(base64, 'data_url')
        else
          task = fileRef.putString(base64)
      } else {
        let base64 = await this.toBase64(file)
        if (base64.indexOf("data:") !== -1)
          task = fileRef.putString(base64, 'data_url')
        else
          task = fileRef.putString(base64)
      }

      task.then(s => {
        console.log(s)

        task.task.snapshot.ref.getDownloadURL().then((downloadURL: string) => {
          console.log('File available at', downloadURL);
          //l.dismiss()
          res(downloadURL)
        }).catch(e => {
          //l.dismiss()
          rej(e)
        })
      }).catch(e => {
        //l.dismiss()
        rej(e)
      })
    })
  }

  getOrientation(file): Promise<number> {
    return new Promise((res, rej) => {


      var reader: any,
        target: EventTarget;
      reader = new FileReader();
      reader.onload = (event) => {

        var view = new DataView(event.target.result);

        if (view.getUint16(0, false) != 0xFFD8) res(-2);

        var length = view.byteLength,
          offset = 2;

        while (offset < length) {
          var marker = view.getUint16(offset, false);
          offset += 2;

          if (marker == 0xFFE1) {
            if (view.getUint32(offset += 2, false) != 0x45786966) {
              res(-1);
            }
            var little = view.getUint16(offset += 6, false) == 0x4949;
            offset += view.getUint32(offset + 4, little);
            var tags = view.getUint16(offset, little);
            offset += 2;

            for (var i = 0; i < tags; i++)
              if (view.getUint16(offset + (i * 12), little) == 0x0112)
                res(view.getUint16(offset + (i * 12) + 8, little));
          }
          else if ((marker & 0xFF00) != 0xFF00) break;
          else offset += view.getUint16(offset, false);
        }
        res(-1);
      };

      reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
    })
  }

  getBase64(file, orientation): Promise<string> {
    return new Promise((res, rej) => {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        var base64 = reader.result;
        this.resetOrientation(base64, orientation, async (resetBase64Image) => {
          let b = await this.dataURItoBlob(resetBase64Image);
          res(b)
        });
      };
      reader.onerror = (error) => {
        console.log('Error: ', error);
        rej(error)
      };
    })
  }

  dataURItoBlob(dataURI): Promise<string> {
    return new Promise((res, rej) => {
      var byteString = atob(dataURI.split(',')[1]);
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      // write the ArrayBuffer to a blob, and you're done
      var bb = new Blob([ab], { type: "image/jpeg" });
      var reader = new FileReader();
      reader.readAsDataURL(bb);
      reader.onloadend = (() => {
        var base64data = reader.result as string;
        res(base64data)
      });
      return bb;
    })
  }

  toBase64(file): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  resetOrientation(srcBase64, srcOrientation, callback) {
    var img = new Image();

    img.onload = () => {
      var width = img.width,
        height = img.height,
        canvas = document.createElement('canvas'),
        ctx = canvas.getContext("2d");

      // set proper canvas dimensions before transform & export
      if (4 < srcOrientation && srcOrientation < 9) {
        canvas.width = height;
        canvas.height = width;
      } else {
        canvas.width = width;
        canvas.height = height;
      }

      // transform context before drawing image
      switch (srcOrientation) {
        case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
        case 3: ctx.transform(-1, 0, 0, -1, width, height); break;
        case 4: ctx.transform(1, 0, 0, -1, 0, height); break;
        case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
        case 6: ctx.transform(0, 1, -1, 0, height, 0); break;
        case 7: ctx.transform(0, -1, -1, 0, height, width); break;
        case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
        default: break;
      }

      // draw image
      ctx.drawImage(img, 0, 0);

      // export base64
      callback(canvas.toDataURL());
    };

    img.src = srcBase64;
  }

}
