const SectionHome = () => {
    return(
        <>
            <section id="home" className="flex flex-col md:flex-row md:pr-8 text-center md:text-left">
        <div className="main-desc my-12 mx-4 md:my-40 md:mx-20 md:text-left">
            <div className="text-[#1D4ED8] text-lg mb-4 font-bold"><p>MOVIE TICKET PURCHASES #1 IN INDONESIA</p></div>
            <div className="text-[47px] font-medium mb-12 text-center md:text-left leading-tight"><p>Experience the Magic of Cinema: Book Your Tickets Today</p></div>
            <div className="text-[#A0A3BD]"><p>Sign up and get the ticket with a lot of discount</p></div>
        </div>

        <div className="flex-container grid grid-cols-2 mt-16 md:mt-16 gap-4 md:mr-12 mx-4 md:mx-auto max-w-[400px] md:max-w-none">
            <div className="spiderman-grid mt-[-0.5rem]">
                <img src="lion-king.svg" alt="lion king" className="w-full h-auto"/>
            </div>
            <div>
                <img src="expendables.svg" alt="spiderman" className="w-full h-auto"/>
            </div>
            <div className="relative bottom-16 md:bottom-26">
                <img src="spiderman.svg" alt="spiderman" className="w-full h-auto"/>
            </div>
            <div>
                <img src="roblox.svg" alt="spiderman" className="w-full h-auto"/>
            </div>
        </div>
    </section>

    <section id="reason" className="mt-8 md:mt-24 flex justify-center md:justify-center">
        <div className="rsn my-12 mx-4 md:my-24 md:mx-20 text-center md:text-left">
            <div className="choose text-[#1D4ED8] font-bold mb-4 md:mb-8 text-center">
                <p>WHY CHOOSE US</p>
            </div>
            <div className="tagline font-normal text-[#121212] text-3xl md:text-[31px] mb-8 md:mb-8 flex flex-wrap justify-center md:justify-center mb-8">
                <p className="w-full flex justify-center md:w-auto text-center md:text-center mb-12 text-[47px]">Unleashing the Ultimate Movie Experience</p>
            </div>
            <div className="benefit-container flex flex-col md:flex-row justify-center items-center gap-12 md:gap-12 text-justify">
                <div className="benefit-guarantee flex flex-col items-center text-center max-w-[280px] w-full">
                    <div><img src="guaranteed.svg" alt="guaranteed" className="mb-4"/></div>
                    <div className="step-number font-bold text-lg mb-4 text-center">Guaranteed</div>
                    <div className="benefit-text text-[#A0A3BD] text-lg text-justify leading-relaxed max-w-[250px]">Lorem ipsum dolor sit amet, consectetur adipis elit. Sit enim nec, proin faucibus nibh et sagittis a. Lacinia purus ac amet.</div>
                </div>
                <div className="benefit-check flex flex-col items-center text-center max-w-[280px] w-full">
                    <img src="check-circle-fill.svg" alt="check" className="p-4 bg-[rgba(29,78,216,0.2)] rounded-full mb-4"/>
                    <div className="step-number font-bold text-lg mb-4 text-center">Affordable</div>
                    <div className="benefit-text text-[#A0A3BD] text-lg text-justify leading-relaxed max-w-[250px]">Lorem ipsum dolor sit amet, consectetur adipis elit. Sit enim nec, proin faucibus nibh et sagittis a. Lacinia purus ac amet.</div>
                </div>
                <div className="benefit-service flex flex-col items-center text-center max-w-[280px] w-full">
                    <img src="247.svg" alt="24/7" className="mb-4"/>
                    <div className="step-number font-bold text-lg mb-4 text-">24/7 Customer Support</div>
                    <div className="benefit-text text-[#A0A3BD] text-lg text-justify leading-relaxed max-w-[250px]">Lorem ipsum dolor sit amet, consectetur adipis elit. Sit enim nec, proin faucibus nibh et sagittis a. Lacinia purus ac amet.</div>
                </div>
            </div>
        </div>
    </section>

    <section id="movie" className="flex flex-wrap flex-row justify-center mt-4 mx-4 md:mx-20">
        <div className="container-movie w-full"/>
            <div className="movies font-bold text-lg text-[#1D4ED8] flex justify-center mb-8 w-full">
                <p>MOVIES</p>
            </div>
            <div className="desc-movie text-[47px] md:text-4xl flex justify-center items-center mb-8 w-full text-center px-4">
                <p className="text-[47px]">Exciting Movies That Should Be Watched Today</p>
            </div>
            <div className="img-container flex flex-col md:flex-row gap-4 max-w-full justify-center overflow-x-scroll md:overflow-x-hidden items-center pb-4 md:pb-0">
                <div className="text-center flex-shrink-0 md:max-w-[200px] w-full">
                    <img src="blackwidow.svg" alt="movie-poster" className="w-full h-auto"/>
                    <div className="title font-bold mt-4 mb-4">Black Widow</div>
                    <div className="genre flex gap-4 justify-center">
                        <div><p className="py-2 px-4 bg-[rgba(160,163,189,0.1)] rounded-full text-xs text-[#A0A3BD]">Action</p></div>
                        <div><p className="py-2 px-4 bg-[rgba(160,163,189,0.1)] rounded-full text-xs text-[#A0A3BD]">Sci-Fi</p></div>
                    </div>
                </div>
                <div className="text-center md:max-w-[200px] flex-shrink-0 w-full">
                    <img src="tenet.svg" alt="movie-poster" className="w-full h-auto"/>
                    <div className="title font-bold mt-4 mb-4">Tenet</div>
                    <div className="genre flex gap-4 justify-center">
                        <div><p className="py-2 px-4 bg-[rgba(160,163,189,0.1)] rounded-full text-xs text-[#A0A3BD]">Drama</p></div>
                        <div><p className="py-2 px-4 bg-[rgba(160,163,189,0.1)] rounded-full text-xs text-[#A0A3BD]">Romance</p></div>
                    </div>
                </div>
                <div className="text-center md:max-w-[200px] flex-shrink-0 w-full">
                    <img src="the-witch.svg" alt="movie-poster" className="w-full h-auto"/>
                    <div className="title font-bold mt-4 mb-4">The Witch</div>
                    <div className="genre flex gap-4 justify-center">
                        <div><p className="py-2 px-4 bg-[rgba(160,163,189,0.1)] rounded-full text-xs text-[#A0A3BD]">Comedy</p></div>
                        <div><p className="py-2 px-4 bg-[rgba(160,163,189,0.1)] rounded-full text-xs text-[#A0A3BD]">Family</p></div>
                    </div>
                </div>
                <div className="text-center md:max-w-[200px] flex-shrink-0 w-full">
                    <img src="spiderman-film.svg" alt="movie-poster" className="w-full h-auto"/>
                    <div className="title font-bold mt-4 mb-4">Spiderman</div>
                    <div className="genre flex gap-4 justify-center">
                        <div><p className="py-2 px-4 bg-[rgba(160,163,189,0.1)] rounded-full text-xs text-[#A0A3BD]">Thriller</p></div>
                        <div><p className="py-2 px-4 bg-[rgba(160,163,189,0.1)] rounded-full text-xs text-[#A0A3BD]">Horror</p></div>
                    </div>
                </div>
            </div>
            <div className="container-movie .img-container mb-32"></div>
            <div className="view flex justify-center mt-8 w-full">
                <a href="home.html" className="flex justify-center items-center gap-2 no-underline font-bold text-[#1D4ED8] text-lg mb-8">
                    View All <img src="arrow-right.svg" alt="arrow right"/>
                </a>
            </div>
    </section>

    <section id="upcoming-movie" className="mx-4 md:mx-20">
        <div className="container">
            <div className="section-title text-[#1D4ED8] font-bold mb-4 text-center md:text-left">
                <p>UPCOMING MOVIE</p>
            </div>
            <div className="up-movie flex flex-col md:flex-row items-center justify-between text-center md:text-left">
                <div><p className="font-normal text-[#121212] md:text-[47px] mb-4 md:mb-8">Exciting Movie Coming Soon</p></div>
                <div className="arrow flex justify-center items-center gap-2 mb-8 md:mb-0">
                    <div className="arrow-left bg-[#A0A3BD] p-3 rounded-full cursor-pointer"><img src="arrow-left.svg" alt=""/></div>
                    <div className="arrow-right bg-[#1D4ED8] text-white p-3 rounded-full cursor-pointer"><img src="arrow-up.svg" alt=""/></div>
                </div>
            </div>
            <div className="img-container flex sm:overflow-x-scroll flex-row gap-4 pb-4">
                <div className="flex-shrink-0 w-[200px] text-center">
                    <img src="blackwidow.svg" alt="upcoming-movie" className="w-full"/>
                    <div className="date font-bold text-[#1D4ED8] mb-2">February 2024</div>
                    <div className="title font-bold mb-4">Black Widow</div>
                    <div className="genre flex gap-4 justify-center">
                        <div><p className="py-2 px-4 bg-[rgba(160,163,189,0.1)] rounded-full text-xs text-[#A0A3BD]">Action</p></div>
                        <div><p className="py-2 px-4 bg-[rgba(160,163,189,0.1)] rounded-full text-xs text-[#A0A3BD]">Adventure</p></div>
                    </div>
                </div>
                <div className="flex-shrink-0 w-[200px] text-center">
                    <img src="tenet.svg" alt="upcoming-movie" className="w-full"/>
                    <div className="date font-bold text-[#1D4ED8] mb-2">Tenet</div>
                    <div className="title font-bold mb-4">Movie Title B</div>
                    <div className="genre flex gap-4 justify-center">
                        <div><p className="py-2 px-4 bg-[rgba(160,163,189,0.1)] rounded-full text-xs text-[#A0A3BD]">Sci-Fi</p></div>
                        <div><p className="py-2 px-4 bg-[rgba(160,163,189,0.1)] rounded-full text-xs text-[#A0A3BD]">Mystery</p></div>
                    </div>
                </div>
                <div className="flex-shrink-0 w-[200px] text-center">
                    <img src="the-witch.svg" alt="upcoming-movie" className="w-full"/>
                    <div className="date font-bold text-[#1D4ED8] mb-2">April 2024</div>
                    <div className="title font-bold mb-4">The Witch</div>
                    <div className="genre flex gap-4 justify-center">
                        <div><p className="py-2 px-4 bg-[rgba(160,163,189,0.1)] rounded-full text-xs text-[#A0A3BD]">Comedy</p></div>
                        <div><p className="py-2 px-4 bg-[rgba(160,163,189,0.1)] rounded-full text-xs text-[#A0A3BD]">Romance</p></div>
                    </div>
                </div>
                <div className="flex-shrink-0 w-[200px] text-center">
                    <img src="spiderman-film.svg" alt="upcoming-movie" className="w-full"/>
                    <div className="date font-bold text-[#1D4ED8] mb-2">May 2024</div>
                    <div className="title font-bold mb-4">spiderman</div>
                    <div className="genre flex gap-4 justify-center">
                        <div><p className="py-2 px-4 bg-[rgba(160,163,189,0.1)] rounded-full text-xs text-[#A0A3BD]">Fantasy</p></div>
                        <div><p className="py-2 px-4 bg-[rgba(160,163,189,0.1)] rounded-full text-xs text-[#A0A3BD]">Adventure</p></div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="subscribe" className="mx-4 md:mx-20 my-8 md:my-24 bg-[url('BG-newslater.svg')] bg-cover bg-center rounded-lg flex justify-center items-center">
        <div className="container-subscribe mt-16 w-full px-4">
            <div className="subs"><p className="text-white text-3xl md:text-4xl mb-12 flex justify-center text-center leading-tight">Subscribe to our newsletter</p></div>
            <div className="input-btn flex flex-col md:flex-row justify-center gap-4 mb-16 items-stretch md:items-center">
                <div>
                    <input type="text" placeholder="First name" className="py-4 px-12 bg-transparent border-2 border-white rounded-lg text-white w-full box-border placeholder-white"/>
                </div>
                <div>
                    <input type="text" placeholder="Email address" className="py-4 px-12 bg-transparent border-2 border-white rounded-lg text-white w-full box-border placeholder-white"/>
                </div>
                <div className="btn-subscribe w-full md:w-auto">
                    <a href="home.html" className="py-4 px-12 bg-white no-underline rounded-lg text-[#1D4ED8] font-bold inline-block text-center w-full box-border">Subscribe Now</a>
                </div>
            </div>
        </div>
    </section>
    </>
    

    )
}

export default SectionHome;