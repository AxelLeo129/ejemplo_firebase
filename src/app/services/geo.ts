import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GeoService {

  constructor(
    private geo: Geolocation,
    private http: HttpClient
  ) { }
  getLocation(): Promise<{ lat: number, lng: number }> {
    return new Promise((res, rej) => {
      this.geo.getCurrentPosition().then(s => {
        res({ lat: s.coords.latitude, lng: s.coords.longitude })
      }).catch(e => {
        console.log("NO GEO FROM NAVIGATOR")
        this.http.get("https://api.ipgeolocation.io/ipgeo?apiKey=f613a3eaa17a49a79d4e78567d0328cf").toPromise().then((s: any) => {
          if (s && s.latitude && s.longitude) res({ lat: parseFloat(s.latitude), lng: parseFloat(s.longitude) })
        })
      })
    })
  }
  geoName(lat, lng): Promise<{ pais: string, departamento: string, municipio: string, zona: string }> {
    return new Promise((response, reject) => {
      ///
      this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&region=gt&key=AIzaSyB8nLk_SgLQcF95G-XmLAWtEg4qD8hkC0w`).toPromise().then((res: any) => {
        console.log(res.results)
        if (!res.results.length) { return response({ pais: "", departamento: "", municipio: "", zona: "" }) }
        let pais = res.results[res.results.length - 1].address_components[0].long_name || "",
          departamento = res.results[res.results.length - 2].address_components[0].short_name || "",
          municipio = res.results[res.results.length - 3].address_components[0].short_name || "",
          zona = res.results[res.results.length - 5] && res.results[res.results.length - 5].address_components ? res.results[res.results.length - 5].address_components[0].short_name || "" : "";
        response({ pais, departamento, municipio, zona })
      })
    })
  }
}
