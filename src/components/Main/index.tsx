import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';

import { Container, CategoriesContainer, MenuContainer, Footer, FooterContainer, CenteredContainer } from './styles';
import { Header } from '../Header';
import { Categories } from '../Categories';
import { Menu } from '../Menu';
import { Button } from '../Button';
import { TableModal } from '../TableModal';
import { Cart } from '../Cart';
import { CartItem } from '../../types/CartItem';
import { Product } from '../../types/Product';

import { api } from '../../utils/api';

import { Empty } from '../Icons/Empty';
import { Text } from '../Text';
import { Category } from '../../types/Category';

export function Main() {
  const [isTableModalVisible, setIsTableModalVisible] = useState(false);
  const [selectedTable, setSelectedTable] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    Promise.all([
      api.get('/categories'),
      api.get('/products'),
    ]).then(([categoriesResponse, productsResponse]) => {
      setCategories(categoriesResponse.data);
      setProducts(productsResponse.data);
      setIsLoading(false);
    });
  }, []);

  async function handleSelecteCategory(categoryId: string) {
    const route = !categoryId ? '/products' : `/categories/${categoryId}/products`;

    setIsLoadingProducts(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    const { data } = await api.get(route);
    setProducts(data);

    setIsLoadingProducts(false);
  }

  function handleSaveTable(table: string) {
    setSelectedTable(table);
  }

  function handleResetOrder() {
    setSelectedTable('');
    setCartItems([]);
  }

  function handleAddToCart(product: Product) {
    if (!selectedTable) {
      setIsTableModalVisible(true);
    }

    setCartItems((prevState) => {
      const itemIndex = prevState.findIndex(cartItem => cartItem.product._id === product._id);

      if (itemIndex < 0) {
        return prevState.concat({
          quantity: 1,
          product
        });
      }

      const newCartItems = [...prevState];
      const item = newCartItems[itemIndex];

      newCartItems[itemIndex] = {
        ...item,
        quantity: item.quantity + 1,
      };

      return newCartItems;
    });
  }

  function handleDecrementCartItem(product: Product) {
    setCartItems((prevState) => {
      const itemIndex = cartItems.findIndex(cartItem => cartItem.product._id ===  product._id);

      const item = prevState[itemIndex];
      const newCartItems = [...prevState];

      if (item.quantity === 1) {
        newCartItems.splice(itemIndex, 1);

        return newCartItems;
      }

      newCartItems[itemIndex] = {
        ...item,
        quantity: item.quantity - 1,
      };

      return newCartItems;
    });

  }

  return (
    <>
      <Container>
        <Header selectedTable={selectedTable} onCancelOrder={handleResetOrder} />

        {isLoading ? (
          <CenteredContainer>
            <ActivityIndicator color="#D73035" size='large' />
          </CenteredContainer>
        ) : (
          <>
            <CategoriesContainer>
              <Categories categories={categories} onSelecteCategory={handleSelecteCategory} />
            </CategoriesContainer>

            {isLoadingProducts ? (
              <CenteredContainer>
                <ActivityIndicator color="#D73035" size='large' />
              </CenteredContainer>
            ): (
              <>
                {products.length > 0 ? (
                  <MenuContainer>
                    <Menu
                      onAddToCart={handleAddToCart}
                      products={products}
                    />
                  </MenuContainer>
                ) : (
                  <CenteredContainer>
                    <Empty />
                    <Text color="#666" style={{ marginTop: 24 }}>
                      Nenhum produto foi encontrado!
                    </Text>
                  </CenteredContainer>
                )}
              </>
            )}
          </>
        )}
      </Container>

      <Footer>
        {/* <FooterContainer> */}
        {!selectedTable && (
          <Button
            onPress={() => setIsTableModalVisible(!isTableModalVisible)}
            disabled={isLoading}
          >
            Novo pedido
          </Button>
        )}

        {selectedTable && (
          <Cart
            cartItems={cartItems}
            onAdd={handleAddToCart}
            onDecrement={handleDecrementCartItem}
            onConfirmOrder={handleResetOrder}
            selectedTable={selectedTable}
          />
        )}
        {/* </FooterContainer> */}
      </Footer>

      <TableModal
        visible={isTableModalVisible}
        onClose={() => setIsTableModalVisible(!setIsTableModalVisible)}
        onSave={handleSaveTable}
      />
    </>
  );
}
