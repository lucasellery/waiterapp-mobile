import { Container, CategoriesContainer, MenuContainer, Footer, FooterContainer } from './styles';
import { Header } from '../Header';
import { Categories } from '../Categories';
import { Menu } from '../Menu';
import { Button } from '../Button';

export function Main() {
  return (
    <>
      <Container>
        <Header />
        <CategoriesContainer>
          <Categories />
        </CategoriesContainer>

        <MenuContainer>
          <Menu />
        </MenuContainer>
      </Container>

      <Footer>
        <FooterContainer>
          <Button onPress={() => alert('novo pedido')}>
            Novo pedido
          </Button>
        </FooterContainer>
      </Footer>
    </>
  );
}
