import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import Navbar from './Navbar'
import Logo from '../assets/logosibus.png'
import '../styles/contact.css'
import Logowsp from '../assets/logowsp.webp'
import Logomaps from '../assets/logomaps.png'

function GroupExample() {
  return (
    <div>
        <div>
            <Navbar></Navbar>
        </div>
        <CardGroup className='card_group'>
            <Card className='card_cuerpo'>
                <Card.Img variant="top" src={Logo} className='logo_card'/>
                <Card.Body>
                <Card.Title>Base velez</Card.Title>
                <Card.Text>
                    This is a wider card with supporting text below as a natural lead-in
                    to additional content. This content is a little bit longer.
                </Card.Text>
                </Card.Body>
                <Card.Footer>
                <div>
                    <a >
                        <img src={Logowsp} className='logo_link'></img>
                    </a>
                    <a target='blank' href='https://maps.app.goo.gl/iwkmCj96sojtK1U1A'>
                        <img src={Logomaps} className='logo_link'></img>
                    </a>
                </div>
                </Card.Footer>
            </Card>
            
            <Card className='card_cuerpo'>
                <Card.Img variant="top" src={Logo} className='logo_card'/>
                <Card.Body>
                <Card.Title>Card title</Card.Title>
                <Card.Text>
                    This card has supporting text below as a natural lead-in to
                    additional content.
                </Card.Text>
                </Card.Body>
                <Card.Footer>
                    <div>
                        <a >
                            <img src={Logowsp} className='logo_link'></img>
                        </a>
                        <a target='blank' href='https://maps.app.goo.gl/iwkmCj96sojtK1U1A'>
                            <img src={Logomaps} className='logo_link'></img>
                        </a>
                    </div>
                </Card.Footer>
            </Card>

            <Card className='card_cuerpo'>
                <Card.Img variant="top" src={Logo} className='logo_card'/>
                <Card.Body>
                <Card.Title>Card title</Card.Title>
                <Card.Text>
                    This is a wider card with supporting text below as a natural lead-in
                    to additional content. This card has even longer content than the
                    first to show that equal height action.
                </Card.Text>
                </Card.Body>
                <Card.Footer>
                    <div>
                        <a >
                            <img src={Logowsp} className='logo_link'></img>
                        </a>
                        <a target='blank' href='https://maps.app.goo.gl/iwkmCj96sojtK1U1A'>
                            <img src={Logomaps} className='logo_link'></img>
                        </a>
                    </div>
                </Card.Footer>
            </Card>
        </CardGroup>
    </div>
    
  );
}

export default GroupExample;