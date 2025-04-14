import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js'
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  where
} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js'
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDGYnq4VKq-YGu4RbfoI_ZHez9fishYjZo",
  authDomain: "insan-cemerlang-afd2f.firebaseapp.com",
  projectId: "insan-cemerlang-afd2f",
  storageBucket: "insan-cemerlang-afd2f.appspot.com",
  messagingSenderId: "686649580589",
  appId: "1:686649580589:web:61374bbbd68adb604eaca4",
  measurementId: "G-LNZTQBCE26"
};

//inisialisasi firebase
const aplikasi = initializeApp(firebaseConfig)
const basisdata = getFirestore(aplikasi)

//fungsi ambil daftar barang 
export async function ambilDaftarBarang() {
  const refDokumen = collection(basisdata, "inventory");
  const kueri = query(refDokumen, orderBy("item"));
  const cuplikanKueri = await getDocs(kueri);
  
  let hasilKueri = [];
  cuplikanKueri.forEach((dokumen) => {
    hasilKueri.push({
      id: dokumen.id,
      item: dokumen.data().item,
      jumlah: dokumen.data().jumlah,
      harga: dokumen.data().harga
    })
  })

  return hasilKueri;
}

// menambah barang ke keranjang 
export async function tambahBarangKeKeranjang(
  idbarang,
  nama,
  harga,
  jumlah,
  idpelanggan,
  namapelanggan
  ) {
  try {
     // periksa apakah idbarang sudah ada di collection transaksi?
     
     // mengambil data di seluruh collection transaksi
     let refDokumen = collection(basisdata, "transaksi")
    
    // membuat query untuk mencari data berdasarkan idbarang
    let querybarang = query(refDokumen, where("idbarang", "==", idbarang))
    
    let snapshotBarang = await getDocs(querybarang)
    let jumlahRecord = 0
    let idtransaksi = ''
    let jumlahsebelumnya = 0
    
    snapshotBarang.forEach((dokumen) => {
      jumlahRecord++
      idtransaksi = dokumen.id
      jumlahsebelumnya = dokumen.data().jumlah
    })
    
     if(jumlahRecord == 0) {
       // kalau belum ada, tambahkan langsung ke collection 
       const refDokumen = await addDoc(collection(basisdata, "transaksi"), {
      idbarang: idbarang,
      nama: nama,
      harga: harga,
      jumlah: jumlah,
      idpelanggan: idpelanggan,
      namapelanggan: namapelanggan
    })
     } else if (jumahRecord == 1){
      // kalau sudah ada, tambahkan jumlahnya saja
      await updateDoc(doc(basisdata, "transaksi", idtransaksi), { jumlah: jumlahsebelumnya})
     }

     
    // menyimpan data ke collection transaksi 
    
    
    // menampilkan pesan berhasil 
    console.log("berhasil menyimpan keranjang")
  } catch (error) {
    // menampilkan pesan gagal 
    console.log(error)
  }
}

//menampilkan barang di keranjang 
export async function ambilDaftarBarangDiKeranjang() {
  const refDokumen = collection(basisdata, "transaksi");
  const kueri = query(refDokumen, orderBy("nama"));
  const cuplikanKueri = await getDocs(kueri);
  
  let hasilKueri = [];
  cuplikanKueri.forEach((dokumen) => {
    hasilKueri.push({
      id: dokumen.id,
      item: dokumen.data().item,
      nama: dokumen.data().nama,
      jumlah: dokumen.data().jumlah,
      harga: dokumen.data().harga
    })
  })

  return hasilKueri;
}

 export async function hapusBarangDariKeranjang(id) {
   await deleteDoc(doc(basisdata, "transaksi", id))
 }
 export async function ambilDaftarPelanggan() {
  const refDokumen = collection(basisdata, "pelanggan");
  const kueri = query(refDokumen, orderBy("nama"));
  const cuplikankueri = await getDocs(kueri);

  let hasilkueri = [];
  cuplikankueri.forEach((dokumen) => {
    hasilkueri.push({
      id: dokumen.id,
      nama: dokumen.data().nama,
      alamat: dokumen.data().alamat,
      nohape: dokumen.data().nohape

    })
  })

  return hasilkueri;
}

 export async function ambilBarangKeranjang() {
   let refDokumen = collection(basisdata, "transaksi")
   
   // membuat query untuk mencari data yg masih proses
   let queryBarangProses = query(refDokumen, where("idPelanggan", "==", "proses"))
   
   let snapshotBarang = await getDocs(queryBarangProses)
   let hasilkuery = []
   snapshotBarang.forEach((dokumen) => {
     hasilkueri.push({
       id: dokumen.id,
      nama: dokumen.data().nama,
      alamat: dokumen.data().alamat,
      harga: dokumen.data().harga,
      idpelangga: dokumen.data().idpelanggan,
      namapelanggan: dokumen.data().namapelanggan,
     })
     
     return hasilkueri
 })
 }
 
 export async function ubahBarangprosesdikeranjang(id, idpelanggan, namapelanggan)
    {

     await updateDoc(
       doc(basisdata,"transaksi", id),
       { idpelanggan: idpelanggan, namapelanggan: namapelanggan }
       )
   
 }

export async function ambilpelanggan(id) {
  const refDokumen = await doc(basisdata,"pelanggan",id)
  const snapshotDokumen = await getDoc(refDokumen)
  
  return await snapshotDokumen.data()
}
