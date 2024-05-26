import Navbar from "./navbar";

const Header = ({children}) => {
    return (
        <>
            <Navbar />
            {children}
        </>
    )
}

export default Header