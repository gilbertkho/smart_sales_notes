import { DefaultTheme } from '@react-navigation/native';

const LightTheme = {
      ...DefaultTheme, // Start with the default light theme and override
      dark: false,
      colors: {        
        primary: 'rgb(255, 45, 85)', // Example primary color
        background: 'rgb(242, 242, 242)', // Example background color
        card: 'rgb(255, 255, 255)', // Example card background color
        text: 'rgb(28, 28, 30)', // Example text color
        border: 'rgb(199, 199, 204)', // Example border color
        notification: 'rgb(255, 69, 58)', // Example notification color
      },
      // You can add a 'fonts' property here if needed
    };

export default LightTheme;