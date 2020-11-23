import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { PlacesService } from '../places/places.service';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component'



@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {
  userCity: string
  userUni: string
  userId: string
  hasPlace: boolean
  selectedCity: string
  selectedUniversity: string
  myPlace: any
  selectedSex: string
  nameSurname: string

  constructor(private authService: AuthService, private placesService: PlacesService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.authService.getUser(localStorage.getItem("userId")).subscribe((user) => {
      this.userCity = user.user.city
      this.userUni = user.user.university
      this.userId = user.user._id
      this.hasPlace = user.hasPlace
      this.selectedSex = user.user.sex
      this.nameSurname = user.user.nameSurname
      if(this.hasPlace){
        this.placesService.getPlace(localStorage.getItem("userId")).subscribe(place => {          
          this.myPlace = place
        })
      }
    })
    
    
  }

  onCityChange(){
   //console.log(this.universities)
    //console.log(this.selectedCity)
    //console.log(this.universities[this.selectedCity])
  }

  onSaveUniversity(form: NgForm){
    console.log('zzzz')
    console.log(this.myPlace)
    if(this.hasPlace && form.value.myCity !== this.myPlace.city && this.hasPlace){
      const dialogRef = this.dialog.open(ConfirmDialogComponent)

      dialogRef.afterClosed().subscribe(res =>{
        if(res){
          this.placesService.deletePlace(this.userId)
          this.authService.updateUserCity(this.userId,form.value.myCity,form.value.myUni)
        }
      })
    }else{
      this.authService.updateUserCity(this.userId,form.value.myCity,form.value.myUni)
    }
    //this.authService.updateUserCity(this.userId,form.value.myCity,form.value.myUni)
  }

  onSaveUserDetails(form: NgForm){
    this.authService.updateUserDetails(this.userId,this.nameSurname,this.selectedSex)
  }











  cities = ['Adana', 'Adıyaman', 'Afyon', 'Ağrı','Aksaray', 'Amasya', 'Ankara', 'Antalya','Ardahan', 'Artvin',
  'Aydın', 'Balıkesir','Bartın','Batman', 'Bayburt','Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale',
  'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır','Düzce', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir',
  'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay','Iğdır', 'Isparta', 'İstanbul', 'İzmir','Karabük', 
  'Karaman','Kars', 'Kastamonu', 'Kayseri','Kırıkkale', 'Kırklareli', 'Kırşehir','Kilis', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 
  'Manisa', 'Kahramanmaraş', 'Mardin', 'Mersin','Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye','Rize', 'Sakarya',
  'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Şanlıurfa','Şırnak','Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli',  'Uşak',
  'Van', 'Yalova','Yozgat', 'Zonguldak']
  universities = {'Adana':['Adana Bilim ve Teknoloji Üniversitesi','Çukurova Üniversitesi'],
  'Adıyaman':['Adıyaman Üniversitesi'],'Afyon':['Afyon Kocatepe Üniversitesi','Afyonkarahisar Sağlık Bilimleri Üniversitesi'],
  'Ağrı': ['Ağrı İbrahim Çeçen Üniversitesi'],'Amasya':['Amasya Üniversitesi'],'Aksaray':['Aksaray Üniversitesi'],
  'Ankara':['Ankara Üniversitesi','Ankara Müzik ve Güzel Sanatlar Üniversitesi','Ankara Hacı Bayram Veli Üniversitesi','Ankara Sosyal Bilimler Üniversitesi',
'Gazi Üniversitesi','Hacettepe Üniversitesi','Orta Doğu Teknik Üniversitesi','Ankara Yıldırım Beyazıt Üniversitesi','Polis Akademisi','Anka Teknoloji Üniversitesi',
'Ankara Bilim Üniversitesi','Ankara Medipol Üniversitesi','Atılım Üniversitesi','Başkent Üniversitesi','Çankaya Üniversitesi','İhsan Doğramacı Bilkent Üniversitesi',
'Lokman Hekim Üniversitesi','Ostim Teknik Üniversitesi','TED Üniversitesi','TOBB Ekonomi ve Teknoloji Üniversitesi','Ufuk Üniversitesi','Türk Hava Kurumu Üniversitesi',
'Yüksek İhtisas Üniversitesi'],'Antalya':['Akdeniz Üniversitesi','Alanya Alaaddin Keykubat Üniversitesi','Alanya Hamdullah Emin Paşa Üniversitesi','Antalya Akev Üniversitesi',
'Antalya Bilim Üniversitesi'],'Ardahan':['Ardahan Üniversitesi'],'Artvin':['Artvin Çoruh Üniversitesi'],'Aydın':['Aydın Adnan Menderes Üniversitesi'],
'Balıkesir':['Balıkesir Üniversitesi','Bandırma Onyedi Eylül Üniversitesi'],'Bartın':['Bartın Üniversitesi'],'Batman':['Batman Üniversitesi'],
'Bayburt':['Bayburt Üniversitesi'],'Bilecik':['Bilecik Şeyh Edebali Üniversitesi'],'Bingöl':['Bingöl Üniversitesi'],'Bitlis':['Bitlis Eren Üniversitesi'],
'Bolu':['Bolu Abant İzzet Baysal Üniversitesi'],'Burdur':['Burdur Mehmet Akif Ersoy Üniversitesi'],'Bursa':['Bursa Teknik Üniversitesi','Bursa Uludağ Üniversitesi'],
'Çanakkale':['Çanakkale Onsekiz Mart Üniversitesi'],'Çankırı':['Çankırı Karatekin Üniversitesi'],'Çorum':['Hitit Üniversitesi'],'Denizli':['Pamukkale Üniversitesi'],
'Diyarbakır':['Dicle Üniversitesi'],'Düzce':['Düzce Üniversitesi'],'Edirne':['Trakya Üniversitesi'],'Elazığ':['Fırat Üniversitesi'],'Erzincan':['	Erzincan Binali Yıldırım Üniversitesi'],
'Erzurum':['Atatürk Üniversitesi','Erzurum Teknik Üniversitesi'],'Eskişehir':['Anadolu Üniversitesi','Eskişehir Osmangazi Üniversitesi','Eskişehir Teknik Üniversitesi'],
'Gaziantep':['Gaziantep Üniversitesi','Gaziantep İslam Bilim ve Teknoloji Üniversitesi','Hasan Kalyoncu Üniversitesi','Sanko Üniversitesi'],
'Giresun':['Giresun Üniversitesi'],'Gümüşhane':['Gümüşhane Üniversitesi'],'Hakkari':['Hakkari Üniversitesi'],'Hatay':['İskenderun Teknik Üniversitesi','Hatay Mustafa Kemal Üniversitesi'],
'Iğdır':['Iğdır Üniversitesi'],'Isparta':['	Süleyman Demirel Üniversitesi','Isparta Uygulamalı Bilimler Üniversitesi'],
'İstanbul':['İstanbul	Boğaziçi Üniversitesi','Galatasaray Üniversitesi','İstanbul Medeniyet Üniversitesi','İstanbul Teknik Üniversitesi','İstanbul Üniversitesi','İstanbul Üniversitesi-Cerrahpaşa',
'Marmara Üniversitesi','Milli Savunma Üniversitesi (Askerî)','Mimar Sinan Güzel Sanatlar Üniversitesi','Türkiye Uluslararası İslam, Bilim ve Teknoloji Üniversitesi','Türk-Alman Üniversitesi',
'Türk-Japon Bilim ve Teknoloji Üniversitesi','Sağlık Bilimleri Üniversitesi','Yıldız Teknik Üniversitesi','Acıbadem Üniversitesi','Bahçeşehir Üniversitesi','Beykent Üniversitesi','Bezmialem Vakıf Üniversitesi',
'Biruni Üniversitesi','Doğuş Üniversitesi','Fatih Sultan Mehmet Üniversitesi','Fenerbahçe Üniversitesi','Gedik Üniversitesi','Haliç Üniversitesi','Işık Üniversitesi','İbn Haldun Üniversitesi','İstanbul 29 Mayıs Üniversitesi',
'Altınbaş Üniversitesi','İstanbul Arel Üniversitesi','İstanbul Atlas Üniversitesi','İstanbul Aydın Üniversitesi','İstanbul Ayvansaray Üniversitesi','Beykoz Üniversitesi','İstanbul Bilgi Üniversitesi',
'İstanbul Galata Üniversitesi','Demiroğlu Bilim Üniversitesi','İstanbul Ticaret Üniversitesi','İstanbul Esenyurt Üniversitesi','İstanbul Gedik Üniversitesi','İstanbul Gelişim Üniversitesi','İstanbul Kent Üniversitesi',
'İstanbul Kültür Üniversitesi','İstanbul Medipol Üniversitesi','İstanbul Okan Üniversitesi','İstanbul Rumeli Üniversitesi','İstanbul Sabahattin Zaim Üniversitesi','İstinye Üniversitesi','Kadir Has Üniversitesi',
'Koç Üniversitesi','Maltepe Üniversitesi','MEF Üniversitesi','Nişantaşı Üniversitesi','Özyeğin Üniversitesi','Piri Reis Üniversitesi','Sabancı Üniversitesi','İstanbul Sağlık ve Teknoloji Üniversitesi','Üsküdar Üniversitesi',
'Yeditepe Üniversitesi','Yeni Yüzyıl Üniversitesi'],'İzmir':['Dokuz Eylül Üniversitesi','Ege Üniversitesi','İzmir Yüksek Teknoloji Enstitüsü','İzmir Kâtip Çelebi Üniversitesi','İzmir Bakırçay Üniversitesi','İzmir Demokrasi Üniversitesi',
'İzmir Ekonomi Üniversitesi','İzmir Tınaztepe Üniversitesi','Yaşar Üniversitesi'],'Kahramanmaraş':['Kahramanmaraş Sütçü İmam Üniversitesi','Kahramanmaraş İstiklal Üniversitesi'],'Karabük':['Karabük Üniversitesi'],
'Karaman':['Karamanoğlu Mehmetbey Üniversitesi'],'Kars':['Kafkas Üniversitesi'],'Kastamonu':['Kastamonu Üniversitesi'],'Kayseri':['Abdullah Gül Üniversitesi','Erciyes Üniversitesi','Kayseri Üniversitesi','Nuh Naci Yazgan Üniversitesi'],
'Kırıkkale':['Kırıkkale Üniversitesi'],'Kırklareli':['Kırklareli Üniversitesi'],'Kırşehir':['Kırşehir Ahi Evran Üniversitesi'],'Kilis':['Kilis 7 Aralık Üniversitesi'],'Kocaeli':['Gebze Teknik Üniversitesi','Kocaeli Üniversitesi','Kocaeli Sağlık ve Teknoloji Üniversitesi'],
'Konya':['Konya Teknik Üniversitesi','Necmettin Erbakan Üniversitesi','Selçuk Üniversitesi','Konya Gıda ve Tarım Üniversitesi','KTO Karatay Üniversitesi'],'Kütahya':['Kütahya Dumlupınar Üniversitesi','Kütahya Sağlık Bilimleri Üniversitesi'],
'Malatya':['İnönü Üniversitesi','Malatya Turgut Özal Üniversitesi'],'Manisa':['Manisa Celal Bayar Üniversitesi'],'Mardin':['Mardin Artuklu Üniversitesi'],'Mersin':['Mersin Üniversitesi','Tarsus Üniversitesi','Çağ Üniversitesi','Toros Üniversitesi'],
'Muğla':['Muğla Sıtkı Koçman Üniversitesi'],'Muş':['Muş Alparslan Üniversitesi'],'Nevşehir':['Nevşehir Hacı Bektaş Veli Üniversitesi','Kapadokya Üniversitesi'],'Niğde':['Niğde Ömer Halisdemir Üniversitesi'],'Ordu':['Ordu Üniversitesi'],
'Osmaniye':['Osmaniye Korkut Ata Üniversitesi'],'Rize':['Recep Tayyip Erdoğan Üniversitesi'],'Sakarya':['Sakarya Üniversitesi','Sakarya Uygulamalı Bilimler Üniversitesi'],'Samsun':['Ondokuz Mayıs Üniversitesi','Samsun Üniversitesi'],'Siirt':['Siirt Üniversitesi'],
'Sinop':['Sinop Üniversitesi'],'Sivas':['Sivas Cumhuriyet Üniversitesi','Sivas Bilim ve Teknoloji Üniversitesi'],'Şanlıurfa':['Harran Üniversitesi'],'Şırnak':['Şırnak Üniversitesi'], 'Tekirdağ':['Tekirdağ Namık Kemal Üniversitesi'],'Tokat':['Tokat Gaziosmanpaşa Üniversitesi'],
'Trabzon':['Karadeniz Teknik Üniversitesi','Trabzon Üniversitesi','Avrasya Üniversitesi'],'Tunceli':['	Munzur Üniversitesi'],'Uşak':['Uşak Üniversitesi'],'Van':['Van Yüzüncü Yıl Üniversitesi'],'Yalova':['Yalova Üniversitesi'],'Yozgat':['Yozgat Bozok Üniversitesi'],
'Zonguldak':['Zonguldak Bülent Ecevit Üniversitesi']}


}
