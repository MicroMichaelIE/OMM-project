// import { useState, useEffect } from 'react';

// export type MemeTemplate = {
//   id: string;
//   name: string;
//   data: string;
// };

// export const TemplateList = () => {
//   const [templates, setTemplates] = useState<MemeTemplate[]>([]);

//   useEffect(() => {
//     const fetchTemplates = async () => {
//       const response = await fetch("http://localhost:3001/api/templates");
//       const data = await response.json();
//       setTemplates(data.templates);
//     };

//     fetchTemplates();
//   }, []);

//   const getImageUrl = (template: MemeTemplate) => {
//     const base64 = template.data.split(',')[1];
//     return `data:image/png;base64,${base64}`;
//   };

//   return (
//     <div>
//       <h1>Template Gallery</h1>
//       <div>
//         {templates.map((template) => (
//           <div key={template.id}>
//             <h2>{template.name}</h2>
//             <img src={getImageUrl(template)} alt={template.name} />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

import React, { useState, useEffect } from "react";
import { Buffer } from 'buffer';
import { useNavigate } from "react-router-dom";



interface Template {
  id: string;
  _id: string;
  name: string;
  data: Buffer;
  type: string;
}

interface TemplateProps {
  template: Template;
}

const TemplateList: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);

  const [hovered, setHovered] = useState(false);
  const [hoveredTemplate, setHoveredTemplate] = useState<Template | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3001/api/templates")
      .then((response) => response.json())
      .then((data) => {
        setTemplates(data.templates);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);


    const getImageUrl = (template: Template): string => {
        const base64String = Buffer.from(template.data).toString('base64');
        return `data:${template.type};base64,${base64String}`;
    };

    const handleMouseEnter = (template: Template) => {
    setHovered(true);
    setHoveredTemplate(template);
    };

    const handleMouseLeave = () => {
        setHovered(false);
        setHoveredTemplate(null);
    };

    const handleTemplateClick = (template: Template) => {
        localStorage.setItem("selectedTemplateId", template._id);
        navigate("/");
    };


return (
    <div>
      <h1>Template Gallery</h1>
      <div>
        {templates.map((template: Template) => (
          <div
            key={template.id}
            className="template"
            onMouseEnter={() => handleMouseEnter(template)}
            onMouseLeave={handleMouseLeave}
            style={{
              position: "relative",
              display: "inline-block",
              margin: "5px",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                backgroundColor: "rgba(0,0,0,0.6)",
                opacity: hovered && hoveredTemplate === template ? 1 : 0,
                transition: "opacity 0.2s ease-in-out",
              }}
            />
            <h2>{template.name}</h2>
            <img
              src={getImageUrl(template)}
              alt={template.name}
              style={{ maxWidth: 300, maxHeight: 300 }}
            />
            {hovered && hoveredTemplate === template && (
              <button
                onClick={() => handleTemplateClick(template)}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "white",
                  padding: "10px",
                  borderRadius: "0",
                  border: "none",
                  fontWeight: "bold",
                }}
              >
                Create a Meme Using {template.name}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default TemplateList;


