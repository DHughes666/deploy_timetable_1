import styled from "styled-components";
import { Link } from "react-router-dom";
import timetabla from '../assets/timetable.PNG';


const Hero = () => {
    return (
        <Wrapper className="section-center">
            <article className="content">
                <h1>
                    Know your <br />
                    lecture Schedule
                </h1>
                <p>
                We're excited to introduce our new Timetable Portal, 
                designed to streamline your academic experience and make 
                managing your schedule easier than ever. At Adeleke University, 
                we understand the importance of staying organized and being 
                able to access your class schedule at a moment's notice. 
                Our Timetable Portal is here to help you do just that. 
                </p>
                <Link to='/timetable' className='btn hero-btn'>
                Get timetable
                </Link>
            </article>
            <article className="img-container">
                <img src={timetabla} alt="timetable" className="main-img"/>
            </article>
        </Wrapper>
    )
}

const Wrapper = styled.section`
  min-height: 60vh;
  display: grid;
  place-items: center;
  .img-container {
    display: none;
  }

  p {
    line-height: 2;
    max-width: 45em;
    margin-bottom: 2rem;
    color: var(--clr-grey-5);
    font-size: 1rem;
  }
  @media (min-width: 992px) {
    height: calc(100vh - 5rem);
    grid-template-columns: 1fr 1fr;
    gap: 8rem;
    h1 {
      margin-bottom: 2rem;
    }
    p {
      font-size: 1.25rem;
    }
    .hero-btn {
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
    }
    .img-container {
      display: block;
      position: relative;
    }
    .main-img {
      width: 100%;
      height: 550px;
      position: relative;
      border-radius: var(--radius);
      display: block;
      object-fit: cover;
    }
    .accent-img {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 250px;
      transform: translateX(-50%);
      border-radius: var(--radius);
    }
    .img-container::before {
      content: '';
      position: absolute;
      width: 10%;
      height: 80%;
      background: var(--clr-primary-9);
      bottom: 0%;
      left: -8%;
      border-radius: var(--radius);
    }
  }
`

export default Hero;