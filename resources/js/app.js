import axios from 'axios';
import Noty from 'noty';
import { initAdmin } from './admin'
import moment from 'moment';

let addToCart = document.querySelectorAll('.add-to-cart');

addToCart.forEach((btn)=>{
    btn.addEventListener('click',(e)=>{
        // console.log(btn);
        // convert JSON to Object
        let pizza = JSON.parse(btn.dataset.pizza);
        updateCart(pizza)
    })
})

let cartCounter = document.querySelector('.cart-counter');

function updateCart(pizza){
    axios.post('/update-cart', pizza).then(res=>{
      //  console.log(res.data.totalQty);
        cartCounter.innerText = res.data.totalQty;

        new Noty({
            type:'success',
            theme: 'metroui',
            timeout: 2000,
            progressBar: false,
            text: "Item add to cart"
        }).show();

    }).catch(err=>{
        new Noty({
            type:'error',
            theme: 'metroui',
            timeout: 2000,
            progressBar: false,
            text: "Something went wrong!"
        }).show();
    });
}

const alertMsg = document.querySelector('#success-alert');
if(alertMsg){
    setTimeout(()=>{
        alertMsg.remove();
    }, 5000);
}



// change order status
let statuses = document.querySelectorAll('.status_line');
let hiddenInput = document.querySelector('#hiddenInput');
let order = hiddenInput ? hiddenInput.value : null;
    order = JSON.parse(order);

let time = document.createElement('small')

function updateStatus(order){
    statuses.forEach((status)=>{
        status.classList.remove('step-completed');
        status.classList.remove('current');

    });


    let stepCompleted = true;
    statuses.forEach((status)=>{
        let dataProp = status.dataset.status;
        if(stepCompleted){
            status.classList.add('step-completed');
        }
        if(dataProp === order.status){
            stepCompleted = false;
            time.innerText = moment(order.updatedAt).format('hh:mm A');
            status.appendChild(time);
            if(status.nextElementSibling){
                status.nextElementSibling.classList.add('current');
            }
        }
    })
}

updateStatus(order);

// Socket client connection
let socket = io();
initAdmin(socket);
if(order){
  //  socket.emit('join', `order_${order._id}`);
    socket.emit('myPrivateRoom', `order_${order._id}`);
}

// Socket recive connection
socket.on('orderUpdated', (data)=>{
    const updatedOrder = {...order}
    updatedOrder.updatedAt = moment().format();
    updatedOrder.status = data.status;
    updateStatus(updatedOrder);
    new Noty({
        type:'success',
        theme: 'metroui',
        timeout: 2000,
        progressBar: false,
        text: "Order updated"
    }).show();
});

// admin side socket io
let adminAreaPath = window.location.pathname;
if(adminAreaPath.includes('admin')){
    socket.emit('myPrivateRoom', 'adminRoom')
}