import React, { FC, useEffect, useState }  from 'react';
import axios from 'axios';
import './Menu.scss';

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
    menuList: MenuItem[],
  }

const Menu: FC<ChildProps> = ({ menuList }) => {
    const [menuObj, setMenuObj] = useState<MenuItem[]>([]);
    const [cart, setCart] = useState<CartItem[]|[]>([]);
    const [order, setOrder] = useState<OrderItem>({});

    // Set menuObj when menu has loaded
    useEffect(() => {
        setMenuObj(menuList);
      }, [menuObj]);

    // Update cart state
    const addToCart = (event: any) => {
        console.log('menu', menuObj);
        const productName = event.target.value;
        const product = menuList.filter(item => item.name === productName)[0];
        setCart(pre => [...pre, {name: product?.name, price: product?.price}]);
        window.alert('The product has added to your cart');
    }

    // Update order state
    const checkout = async () => {
        setMenuObj([]);
        const result = await axios(
          `https://private-anon-3f35ae8fa6-pizzaapp.apiary-mock.com/orders/1234412`,
        );
        const order = result.data;
        setOrder(order);
        setCart([]);
    }

    return (
        <div>

            <div className='menu-wrapper'>
            {((menuObj?.length === 0) && order !== null) ? menuList.map((item, index) =>
                <div className="menu-card">
                    <div className="menu-content" key={index}>
                        <h1>{item.name}</h1>
                        <h6>{item.price} sek</h6>
                        <button value={item.name} onClick={(event) => addToCart(event)}>add to cart</button>
                    </div>
                </div>
            ): ''}
            </div>
                
            <div className='cart-wrapper'>
                {cart.length >= 1 ? <h1>Your cart</h1> : <h1>Welcome to Pizzeria!</h1>}
                {cart && cart.map((item, index) =>
                    <div className='cart-items' key={index}>
                        <p>{item.name}</p>
                        <p>{item.price} sek</p>
                    </div>)}
                {(cart.length !== 0) ? <button onClick={() => checkout()}>Checkout</button> :''}
            </div>

            {(order.orderId !== undefined) ?  
                <div className='order-wrapper'>
                    <p>Thank you for your order!</p>
                    <div className='order-content'>
                        <h6>order id</h6>
                        <p>{order.orderId!}</p>
                        <h6>Total Price</h6>
                        <p>{order.totalPrice} sek</p>
                        <h6>Order at</h6>
                        <p>{order.orderedAt}</p>
                        <h6>Esitmated Delivery</h6>
                        <p>{order.status}</p>
                    </div>
                </div>
            :'' 
            }
        </div>

    )
}

export default Menu;