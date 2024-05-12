
// Importando as funções necessárias
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js"
import { getDocs, limit, query } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";
import { updateDoc, collection, getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
const firebaseConfig = {
    apiKey: "AIzaSyCjaQCG210hmK74C2_XImjQ1p7p8RYRCWM",
    authDomain: "peca-4e2b2.firebaseapp.com",
    projectId: "peca-4e2b2",
    storageBucket: "peca-4e2b2.appspot.com",
    messagingSenderId: "224852416031",
    appId: "1:224852416031:web:79b29796867d1dad6a672a",
    measurementId: "G-MTRQLGRE5B"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const storage = getStorage(app)
const cards = document.getElementById('onde')

// Inicialize o Firebase
async function exibirProdutos() {
    // Referência para a coleção de produtos
    const productsRef = collection(db, 'produtos');

    // Crie uma consulta para obter os primeiros 4 produtos

    // Obtenha os documentos
    const querySnapshot = await getDocs(productsRef);

    // Exiba os produtos

    querySnapshot.forEach(async (doc) => {
        const produto = doc.data();
        const imgRef = ref(storage, produto.img);
        const url = await getDownloadURL(imgRef);


        const card = ` <div class="card" style="width: 18rem;">
        <img src="${url}" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title" name="nome-produto">Nome: ${produto.nome}</h5>
          <p class="card-text" name="preco-produto">Valor: ${produto.preco}</p>
          <p class="card-text" name="quantidade-produto">Quantidade: ${produto.quantidade}</p>
          <a  type="submit" class="btn btn-primary" data-id="${doc.id}" data-js="btn-compra">Comprar</a>
        </div>

`


        cards.innerHTML += card

    });
}

exibirProdutos();
async function comprarProduto(idproduto) {
    // Referência para o documento do produto
    const productRef = doc(db, 'produtos', idproduto);

    // Obtenha os dados atuais do produto
    const productSnap = await getDoc(productRef);
    if (!productSnap.exists()) {
        console.log('Produto não encontrado!');
        return;
    }

    const produto = productSnap.data();


    const novaQuantidade = produto.quantidade - 1;
    await updateDoc(productRef, { quantidade: novaQuantidade });

    console.log('Compra realizada com sucesso!');
}

cards.addEventListener('click', (event) => {
    const elementoClicado = event.target;
    const id= elementoClicado.dataset.js;
    console.log(elementoClicado,elementoClicado.dataset);
     if  ("btn-compra" === id){
        comprarProduto(elementoClicado.dataset.id);
    }
})