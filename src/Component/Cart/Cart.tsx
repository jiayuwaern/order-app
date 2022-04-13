import React, { FC, useEffect, useState }  from 'react';
import axios from 'axios';

interface MenuItem {
    id: number,
    name: string,
    price: number
}

interface CartItem {
    name?: string,
    price?: number,
}

interface OrderItem {
    orderId?: number, 
    totalPrice?: number,
    orderedAt?: string, 
    esitmatedDelivery?: string, 
    status?: string
}

type ChildProps = {
    cart?: CartItem[] | undefined,
    setCart: React.Dispatch<React.SetStateAction<CartItem[]>>,
    menu?: MenuItem[] | undefined,
    setMenu: React.Dispatch<React.SetStateAction<MenuItem[]>>,
    order? : OrderItem | undefined,
    setOrder: React.Dispatch<React.SetStateAction<OrderItem>>
  }

const Cart: FC<ChildProps>  = ({ cart, setCart, menu, setMenu, order, setOrder }) => {

    const checkout = async () => {
        setMenu([]);
        const result = await axios(
          `https://private-anon-3f35ae8fa6-pizzaapp.apiary-mock.com/orders/1234412`,
        );
        const order = result.data;
        setOrder(order);
        setCart([]);
    }

    return (
        <div className='cart-wrapper'>
            {cart!.length >= 1 ? <h1>Your cart</h1> : <h1>Welcome to Pizzeria!</h1>}
            {cart && cart.map((item, index) =>
                <div className='cart-items' key={index}>
                    <p>{item.name}</p>
                    <p>{item.price} sek</p>
                </div>)}
            {(cart!.length !== 0) ? <button onClick={() => checkout()}>Checkout</button> :''}
        </div>
    )

}

export default Cart;