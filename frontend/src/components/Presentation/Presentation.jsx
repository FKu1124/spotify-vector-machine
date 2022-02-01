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

                    <section data-auto-animate>
                        <h2>Spotify keeps recommending the same Songs?</h2>
                    </section>

                    <section data-auto-animate>
                        <h2>You want to get recommendations for different moods?</h2>
                    </section>

                    <section data-auto-animate>
						<h2>Here is the solution:</h2>
					</section>

                    <section data-auto-animate>
						<h1><span>Spotify</span><span> Vector</span><span> Machine</span></h1>
					</section>
					<section data-auto-animate>
						<h2>Spotify Vector Machine</h2>
					</section>
                    <section data-auto-animate>
						<h2>Spotify Vector Machine</h2>
						<h4>Let us help you change your mood:</h4>
					</section>

                    <section data-auto-animate>
						<h2>Spotify Vector Machine</h2>
						<h4>Let us help you change your mood:</h4>
						<ol>
							<li>Draw a vector into Music-Emotion-Grid</li>
						</ol>
					</section>
                    <section data-auto-animate>
						<h2>Spotify Vector Machine</h2>
						<h4>Let us help you change your mood:</h4>
						<ol>
							<li>Draw a vector into Music-Emotion-Grid</li>
							<li>Choose a Genre</li>
						</ol>
					</section>
                    <section data-auto-animate>
						<h2>Spotify Vector Machine</h2>
						<h4>Let us help you change your mood:</h4>
						<ol>
							<li>Draw a vector into Music-Emotion-Grid</li>
							<li>Choose a Genre</li>
							<li>Enjoy!</li>
						</ol>
					</section>

                    <section>
					<section data-transition="slide">
						<h2>Project Reflection</h2>
					</section>
					<section data-auto-animate>
						<h3>TechStack</h3>
						<ul>
							<p><strong>Pandas: </strong>Numpy, Sklearn, Spotipy, bs4</p>
							<p><strong>React: </strong>Tailwind</p>
							<p><strong>Postgres </strong>(dockerized)</p>
						</ul>
					</section>
					<section>
						<h3>Project Tools</h3>
						<ul>
							<p><strong>GitHub</strong></p>
							<p><strong>Figma Designs</strong></p>
						</ul>
					</section>
					<section>
						<h3>Organization</h3>
						<ul>
							<p><strong>Technological Infrastructure: </strong></p>
							<li>Backend</li>
							<li>Frontend/Design</li>
							<li>Recommender</li>
							<p><strong>Contextual Research</strong></p>
						</ul>
					</section>
					<section data-auto-animate>
						<h2></h2>
					</section>
					<section data-auto-animate>
						<h2>TechStack</h2>
						<ul>
							<p><strong>Pandas: </strong>Numpy, Sklearn, Spotipy, bs4</p>
							<p><strong>React: </strong>Tailwind</p>
							<p><strong>Postgres </strong>(dockerized)</p>
						</ul>
					</section>
				</section>

                <section>
					<section data-auto-animate>
						<h2>Data Integration</h2>
					</section>
					<section data-auto-animate>
						<h3>TechStack</h3>
						<ul>
							<p><strong>Spotify: </strong>Metadata, Artist Information, Audiofeatures</p>
							<p><strong>Last.FM: </strong>Community Tags</p>
							<p><strong>Scraper: </strong>Spotipy, Last.FM (scraper selfmade), everynoise.com (requests, bs4)</p>
						</ul>
					</section>
				</section>

                <section>
					<section data-auto-animate>
						<h1>Recommender</h1>
					</section>
					<section data-auto-animate>
						<h2>Recommender</h2>
						<h4>Item Profile</h4>
						<ul>
							<p class="fragment fade-in"><strong>Data Sources: </strong>Spotify, Last.FM</p>
							<p class="fragment fade-in">&raquo; Weighted Features</p>
							<p class="fragment fade-in">&raquo; CountVector</p>
						</ul>
					</section>
					<section data-auto-animate>
						<h2>Recommender</h2>
						<h4>User Profile</h4>
						<p>Fetch personal music preferences from existing Spotify Profile: </p>
						<ul class="fragment fade-in">
							<li>Liked Tracks</li>
							<li>Recent Tracks</li>
							<li>Top Tracks: short-term, medium-term, long-term</li>
							<p class="fragment fade-in"> &rarr; each playlist can be weighted</p>
						</ul>
					</section>
					<section data-auto-animate>
						<h2>Recommender</h2>
						<h4>User Profile</h4>
						<ol>
							<li>Fetch personal music preferences from existing Spotify Profile</li>
						</ol>
					</section>
					<section data-auto-animate>
						<h2>Recommender</h2>
						<h4>User Profile</h4>
						<ol>
							<li>Fetch personal music preferences from existing Spotify Profile</li>
							<li>Create subsets of tracks associated to user by genre cluster</li>
						</ol>
					</section>
					<section data-auto-animate>
						<h2>Recommender</h2>
						<h4>User Profile</h4>
						<ol>
							<li>Fetch personal music preferences from existing Spotify Profile</li>
							<li>Create subsets of tracks associated to user by genre cluster</li>
							<li>For each subset: Create user-genre-profile based on song profiles included</li>
						</ol>
					</section>
					<section data-auto-animate>
						<h2>Recommender</h2>
						<ul>
							<li>Content-based Filtering</li>
							<p class="fragment fade-in"> &rarr; Cosine similarity of picked user-genre-profile & track-feature-matrix</p>
                        </ul>
					</section>
					<section data-auto-animate>
						<h2>Recommender</h2>
						<ul>
							<li>Content-based Filtering</li>
							<p> &rarr; Cosine similarity of picked user-genre-profile & track-feature-matrix</p>
							<li>Filtered by energy/valence values derived from drawn vector</li>
						</ul>
						<p class="fragment fade-in">&raquo; Playlist containing transition from start to end mood</p>
					</section>
				</section>




                
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
                        <h1>Spotify keeps recommending the same Songs?</h1>
                    </section>
                    <section data-auto-animate>
                        <h1>You want to get recommendations for different moods?</h1>
                    </section>
                    <section data-auto-animate>
                        <h1>Here is the solution:</h1>
                    </section>
                    <section data-auto-animate>
                        <span>S</span><span>V</span><span>M</span>
                    </section>
                    <section data-auto-animate>
                        <span>S</span><span>potify</span><span> V</span><span>ector</span><span> M</span><span>achine</span>
                    </section>
                    <section data-auto-animate>
                        <h1>Spotify Vector Machine</h1>

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