import React from 'react';

export const PhotoGrid: React.FC = () => {
  return (
    <section className="pt-20 pb-0 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Row 1: Gala (Main Large) and Two smaller on right */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 mb-4 lg:mb-6">
          {/* Top-Left: Gala */}
          <div className="w-full lg:w-[65%]">
            <img 
              src="/images/gallery_gala_1767601463921.png" 
              alt="Gala" 
              className="w-full h-[300px] lg:h-[500px] object-cover rounded-3xl shadow-md"
            />
          </div>

          {/* Top-Right: Two images stacked */}
          <div className="w-full lg:w-[35%] flex flex-col gap-4 lg:gap-6">
            <img 
              src="/images/gallery_medical_1767601428468.png" 
              alt="Distribution" 
              className="w-full h-[150px] lg:h-[220px] object-cover rounded-3xl shadow-md"
            />
            <div className="flex gap-4 lg:gap-6 h-[134px] lg:h-[256px]">
              <img 
                src="/images/gallery_volunteers_1767601495628.png" 
                alt="Bénévoles" 
                className="w-[70%] h-full object-cover rounded-3xl shadow-md"
              />
              <div className="bg-[#BCE6F5] w-[30%] h-full rounded-3xl"></div>
            </div>
          </div>
        </div>

        {/* Row 2: Kids, Spacer and Hands */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 mb-4 lg:mb-6 items-center">
          <div className="w-full lg:w-[35%] flex flex-col gap-4 lg:gap-6">
            <img 
              src="/images/gallery_kids_1767601480524.png" 
              alt="Enfants" 
              className="w-full h-[220px] lg:h-[260px] object-cover rounded-3xl shadow-md"
            />
            {/* Added a spacer block to push content like in image 1 */}
            <div className="flex items-center gap-4">
               <img 
                src="/images/gallery_school_1767601411654.png" 
                alt="École" 
                className="w-[85%] h-[200px] lg:h-[260px] object-cover rounded-3xl shadow-md"
              />
              <div className="w-[15%] h-[40px] bg-[#BCE6F5] rounded-full"></div>
            </div>
          </div>

          <div className="w-full lg:w-[65%]">
            <img 
                src="/images/mains_solidaires_rouge.png" 
                alt="Mains solidaires" 
                className="w-full h-[250px] lg:h-[544px] object-cover rounded-3xl shadow-md"
            />
          </div>
        </div>

        {/* Row 3: Full width distribution */}
        <div className="w-full mb-10">
           <img 
            src="/images/action_communaute_afrique.png" 
            alt="Distribution communautaire Afrique" 
            className="w-full h-[250px] lg:h-[450px] object-cover rounded-3xl shadow-md"
          />
        </div>

      </div>
    </section>
  );
};
