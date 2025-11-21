export default function OurStory() {
  return (
    <div className="min-h-screen py-20 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <h2 
          className="text-[7vw] md:text-[5vw] lg:text-[4vw] tracking-wide text-gray-900 mb-16"
        >
          Our Story
        </h2>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left - Image */}
          <div className="relative">
            <div className="sticky top-20">
              {/* Main Image */}
              <div className="relative overflow-hidden">
                <img 
                  src="/ourstory.png"
                  alt="Our Story"
                  className="w-full  object-cover"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                
              </div>
              
              {/* Decorative element */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 border border-amber-700/30 -z-10" />
            </div>
          </div>
          
          {/* Right - Text Content */}
          <div className="flex flex-col justify-center">
            {/* Decorative line */}
            <div className="w-16 h-px bg-primary mb-8" />
            
            {/* Story Text */}
            <div className="space-y-6 text-gray-700 leading-relaxed text-base lg:text-lg">
              <p>
                In the late 1800s, most Tasmanian vineyards were removed as the region was considered too cold for wine production, and many workers left for the Victorian gold rush. The industry remained dormant until the mid-1950s, when Wineicy founder <span className="text-gray-900 font-medium">Alessandro Vieri</span> revived local viticulture by planting 90 Riesling vines sourced from pioneering South Australian growers.
              </p>
              <p>
                In 1986, the owner of the historic Lowestoft property invited Wineicy to plant and supply Pinot Noir fruit to its estate winery. The 3-hectare block, planted exclusively with Pinot Noir, later became an important source for Wineicy's reserve releases under renowned viticulturist <span className="text-gray-900 font-medium">Fred Peacock</span>.
              </p>
              
              <p>
                In 2017, Wineicy Group Executive Chairman <span className="text-gray-900 font-medium">Peter Fogarty</span> began exploring Tasmania's historic vineyard sites and recognised the significance of Lowestoft and its surrounding terroir. Wineicy acquired the estate in 2019, along with Strelley Farm and Gilling Brook, ushering in a new era of Tasmanian cool-climate winemaking for the brand.
              </p>
            </div>
            
            {/* Timeline highlights */}
            <div className="mt-12 pt-8 border-t text-primary border-gray-300">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { year: '1956', event: 'First Vines' },
                  { year: '1976', event: 'Pinot Noir' },
                  { year: '2019', event: 'New Era' },
                ].map((item, i) => (
                  <div key={i} className="text-center">
                    <p 
                      className="text-2xl lg:text-3xl"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {item.year}
                    </p>
                    <p className="text-xs uppercase tracking-wider text-gray-500 mt-1">
                      {item.event}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}