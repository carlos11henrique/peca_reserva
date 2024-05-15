// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js"

import { getFirestore, doc, collection, serverTimestamp, setDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js"

import { getStorage, ref, uploadBytes, } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";

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

const form = document.forms.cadastro
const alertModal = new bootstrap.Modal(document.getElementById('alertModal'))
const bodyModal = document.querySelector("div[data-js='modal-body']")
const titleModal = document.querySelector('h1[data-js="title-modal"]')
const containerLoading = document.querySelector('div[data-js="loading"')

form.addEventListener('submit', async (e) => {
    e.preventDefault()

    containerLoading.style.display = 'flex'

    const nome = form.elements['nome-produto']?.value.trim()
    const preco = form.elements['preco-produto']?.valueAsNumber
    const descricao = form.elements['descricao-produto']?.value.trim()
    const quantidade = form.elements['quantidade-produto']?.valueAsNumber
    const imagem = form.elements['imagem-produto']?.files[0]

    if (!nome || descricao.length < 20 || !imagem) {
        return
    }

    if (typeof preco !== 'number' || preco <= 0) {
        return
    }

    if (typeof quantidade !== 'number' || quantidade <= 0 || !Number.isInteger(quantidade)) {
        return
    }

    const newProductRef = doc(collection(db, 'produtos'))
    const idProduto = newProductRef.id

    const produto = {
        nome, preco, descricao, quantidade,
        img: idProduto,
        timestamp: serverTimestamp()
    }

    try {
        const refImg = ref(storage, idProduto)
        await setDoc(newProductRef, produto)
        await uploadBytes(refImg, imagem)
        titleModal.textContent = "Sucesso"
        bodyModal.textContent = "Produto Cadastrado com Sucesso!"
        form.reset()
    } catch (error) {
        titleModal.textContent = "Erro"
        bodyModal.textContent = "Erro ao Cadastrar Produto!"
    } finally {
        containerLoading.style.display = 'none'
        alertModal.show();
    }

})