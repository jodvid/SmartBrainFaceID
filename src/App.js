import React, { Component } from 'react';
import Particles from 'react-tsparticles';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Signin from  './Components/SignIn/Signin';
import Register from './Components/Register/Register';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import './App.css';

const particlesOptions = {
  
  background: {
    color: {
        value: "#0d47a1 10%"
    }
},
fpsLimit: 60,
interactivity: {
    events: {
        onClick: {
            enable: true,
            mode: "push"
        },
        onHover: {
            enable: true,
            mode: "repulse"
        },
        resize: true
    },
    modes: {
        bubble: {
            distance: 400,
            duration: 2,
            opacity: 0.8,
            size: 40
        },
        push: {
            quantity: 4
        },
        repulse: {
            distance: 100,
            duration: 0.4
        }
    }
},
particles: {
    color: {
        value: "#ffffff"
    },
    links: {
        color: "#ffffff",
        distance: 150,
        enable: true,
        opacity: 0.5,
        width: 1
    },
    collisions: {
        enable: true
    },
    move: {
        direction: "none",
        enable: true,
        outMode: "bounce",
        random: false,
        speed: 1,
        straight: false
    },
    number: {
        value: 30,
        density: {
            enable: true,
            value_area: 900
        },
    },
    opacity: {
        value: 0.5
    },
    shape: {
        type: "circle"
    },
    size: {
        random: true,
        value: 5
    }
},
detectRetina: true

}

const initialState = {
    input: '',
    imageUrl: '',
    boxes: [],
    route: 'signin',
    isSignedIn: false,
    user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
    }
} 

class App extends Component {
    constructor() {
        super();
        this.state = initialState;
    }
    
    loadUser = (data) => {
        this.setState({
            user: {
                 id: data.id,
                name: data.name,
                email: data.email,
                entries: data.entries,
                joined: data.joined,
        },
    });
    };    

    calculateFaceLocations = (data) => {
     const clarifaiFaces = data.outputs[0].data.regions.map(
        (region) => region.region_info.bounding_box
        );
     const image = document.getElementById("inputImage");
     const width = Number(image.width);
     const height = Number(image.height);
     
     return clarifaiFaces.map((clarifaiFace) => ({
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,      
     }));
    };        
    displayFaceBoxes = (boxes) => {
        this.setState({ boxes: boxes });         
    };

    onInputChange = (event) => {
        this.setState({ input: event.target.value });
    };

    onButtonSubmit = () => {
        this.setState({imageUrl: this.state.input});
            fetch('https://fast-hollows-71369.herokuapp.com/imageurl', { 
                method: 'post', 
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    input: this.state.input,
                })
            })
            .then(response => response.json())
            .then(response => {
            if (response) {
                fetch('https://fast-hollows-71369.herokuapp.com/image', { 
                    method: 'put', 
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        id: this.state.user.id
                    })
                })
                .then((response) => response.json())
                .then((count) => {
                    this.setState(Object.assign(this.state.user, { entries: count }));
                })
                .catch(console.log);
            }
            this.displayFaceBoxes(this.calculateFaceLocations(response));
        })
        .catch((err) => console.log(err));
     };

     onRouteChange = (route) => {
         if (route === 'signout') {
         this.setState(initialState)
         } else if (route === 'home') {
             this.setState({isSignedIn: true})
         }
         this.setState({route: route});
     }
     
render() {
    const { isSignedIn, imageUrl, route, boxes } = this.state; 
    return (
    <div className="App">
      <div>
        <Particles className='particles' params={particlesOptions}/>
      </div>
      <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
      { route === 'home'
      ? <div>
          <Logo/> 
          <Rank name={this.state.user.name} entries={this.state.user.entries}/>
          <ImageLinkForm 
          onInputChange={this.onInputChange} 
          onButtonSubmit={this.onButtonSubmit}
          />
        <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
        </div>
        : (
            route === 'signin'
          ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
        )
        
    }
    </div>
    );
   }
}
//adding comment here
export default App; 