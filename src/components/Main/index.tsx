import { useState } from 'react';
import { Container, CategoriesContainer, MenuContainer, Footer, FooterContainer } from './styles';
import { Header } from '../Header';
import { Categories } from '../Categories';
import { Menu } from '../Menu';
import { Button } from '../Button';
import { TableModal } from '../TableModal';
import { Cart } from '../Cart';
import { CartItem } from '../../types/CartItem';
import { products } from '../../mocks/products';

export function Main() {
  const [isTableModalVisible, setIsTableModalVisible] = useState(false);
  const [selectedTable, setSelectedTable] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      quantity: 1,
      product: products[0],
    },
    {
      quantity: 2,
      product: products[1],
    },
  ]);

  function handleSaveTable(table: string) {
    setSelectedTable(table);
  }

  function handleCancelOrder() {
    setSelectedTable('');
  }

  return (
    <>
      <Container>
        <Header selectedTable={selectedTable} onCancelOrder={handleCancelOrder} />
        <CategoriesContainer>
          <Categories />
        </CategoriesContainer>

        <MenuContainer>
          <Menu />
        </MenuContainer>
      </Container>

      <Footer>
        <FooterContainer>
          {!selectedTable && (
            <Button onPress={() => setIsTableModalVisible(!isTableModalVisible)}>
              Novo pedido
            </Button>
          )}

          {selectedTable && (
            <Cart cartItems={cartItems} />
          )}
        </FooterContainer>
      </Footer>

      <TableModal
        visible={isTableModalVisible}
        onClose={() => setIsTableModalVisible(!setIsTableModalVisible)}
        onSave={handleSaveTable}
      />
    </>
  );
}
