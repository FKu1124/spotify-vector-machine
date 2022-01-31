import { useEffect } from "react";
import Reveal from 'reveal.js';
import { useNavigate } from "react-router-dom";
import '../../static/reveal.js/reset.css';
import '../../static/reveal.js/reveal.css';
import '../../static/reveal.js/theme/white.css';
import { useUserStore } from "../../store/userStore";
import { Intro } from './Intro'

export default function Presentation({ scrollBack }) {
    const navigate = useNavigate()
    const { setShowPresentation } = useUserStore()

    useEffect(() => {
        Reveal.initialize({
            embedded: true,
            mouseWheel: false,
            backgroundTransition: 'slide',
            transition: 'slide',
            navigationMode: 'grid'
        })
    }, [])

    return (
        <div className="w-screen h-screen">
            <div className="reveal">
                {/* Any section element inside of this container is displayed as a slide */}
                <div className="slides" data-transition="slide">
                    <section data-transition="slide" data-background-color="#001220">
                        {/* <a href="https://revealjs.com">
                            <img
                                src="https://static.slid.es/reveal/logo-v1/reveal-white-text.svg"
                                alt="reveal.js logo"
                                style={{
                                    height: "180px",
                                    margin: "0 auto 4rem auto",
                                    background: "transparent",
                                }}
                                className="demo-logo"
                            />
                        </a> */}
                        <h2>The Spotify Vector Machine 🧑‍💻 📈 + 🎶 = 🎉</h2>
                    </section>
                    
                    {/* <Intro /> */}
                    <section data-transition="slide">
                        <h2>Hello There</h2>
                        <p>
                            reveal.js enables you to create beautiful interactive
                            slide decks using HTML. This presentation will show you
                            examples of what it can do.
                        </p>
                        <button onClick={() => scrollBack()}>Go Home</button>
                    </section>

                    <section>
                        <h2 className="fragment shrink current-visible" >SVM</h2>
                        <h2 class="fragment grow current-visible" >Spotify Vector Machine</h2>
                    </section>

                    <section data-auto-animate>
                        <ul>
                            <li>Mercury</li>
                            <li>Jupiter</li>
                            <li>Mars</li>
                        </ul>
                    </section>
                    <section data-auto-animate>
                        <ul>
                            <li>Mercury</li>
                            <li>Earth</li>
                            <li>Jupiter</li>
                            <li>Saturn</li>
                            <li>Mars</li>
                        </ul>
                    </section>

                    <section data-auto-animate>
                        <span>S</span><span>V</span><span>M</span>
                    </section>
                    <section data-auto-animate>
                        <span>S</span><span>upport</span><span> V</span><span>ector</span><span> M</span><span>achine</span>
                    </section>

                    <section>
                        <p class="fragment grow">grow</p>
                        <p class="fragment shrink">shrink</p>
                        <p class="fragment fade-out">fade-out</p>
                        <p class="fragment current-visible">visible only once</p>
                        <p class="fragment highlight-current-blue">blue only once</p>
                        <p class="fragment highlight-red">highlight-red</p>
                        <p class="fragment highlight-green">highlight-green</p>
                        <p class="fragment highlight-blue">highlight-blue</p>
                    </section>

                    <section data-transition="slide">
                        <h2>Marvelous List</h2>
                        <ul>
                            <li>No order here</li>
                            <li>Or here</li>
                            <li>Or here</li>
                            <li>Or here</li>
                        </ul>
                    </section>

                    <section data-transition="slide">
                        <h2>Fantastic Ordered List</h2>
                        <ol>
                            <li>One is smaller than...</li>
                            <li>Two is smaller than...</li>
                            <li>Three!</li>
                        </ol>
                    </section>
                    <section className="flex justify-center">
                        <h2>Thank You For Your Attention!</h2>
                        <div className="h-20" />
                        <h3>Any Questions?</h3>
                    </section>
                </div>
            </div>
        </div>
    );
}