import { NavigationContainer } from '@react-navigation/native';
import { SignIn } from '../screens/SignIn';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import { AppRoutes } from './app.routes';
import { useState, useEffect } from 'react';
import { Loading } from '../components/Loading';


export function Routes () {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<FirebaseAuthTypes.User>();

    useEffect( () => {
     const subscribe = auth().onAuthStateChanged(response => {
        setUser(response);
        setLoading(false);
     });
     return subscribe;
    },[])

    if(loading) {
        return <Loading />
    }
    return(
        <NavigationContainer>
            { user ? <AppRoutes /> : <SignIn />}
        </NavigationContainer>
    );
}