import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getTemplatesBackend } from "../../services/templateService";
import { templateURL } from "../../services/urlService";
import { Template } from "../../types/types";

import "./Templates.scss";


interface TemplateProps {
  template: Template;
}

export const TemplateList = () => {
  const [stateTemplates, setTemplates] = useState<Template[]>([]);

  const [hovered, setHovered] = useState(false);
  const [hoveredTemplate, setHoveredTemplate] = useState<Template | null>(null);
  const navigate = useNavigate();

  const getTemplates = async () => {
    const { ok, templates, message } = await getTemplatesBackend();
    if (ok) {

      setTemplates(templates);
      console.log(templates)
    } else {
      console.error(message);
    }
  }

  useEffect(() => {
    getTemplates();

  }, []);


  // const getImageUrl = (template: Template): string => {
  //   const base64String = Buffer.from(template.data).toString('base64');
  //   return `data:${template.type};base64,${base64String}`;
  // };


  const handleMouseEnter = (template: Template) => {
    setHovered(true);
    setHoveredTemplate(template);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setHoveredTemplate(null);
  };

  const handleTemplateClick = (template: Template) => {
    console.log(template)
    navigate(`/`, { state: { template } });
  };

  const readAloud = (e: React.SyntheticEvent<HTMLButtonElement>, template: Template) => {
    e.stopPropagation()
    const msg = new SpeechSynthesisUtterance();
    let text = `Name of photo is: ${template.givenName}. The description by the uploader is: ${template.longerDescription || 'not available'}`;
    msg.lang = "en-IE";
    msg.text = text
    window.speechSynthesis.speak(msg);
    msg.onend = () => {
      console.log("done speaking");
    }

  };

  return (
    <div>
      <h1>Template Gallery</h1>
      <div>
        {stateTemplates.map((template: Template) => (
          <div
            key={template._id}
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
              className="top">
              <h4>{template.givenName}</h4>
              <div className={`cover ${hovered && hoveredTemplate === template ? "hovered" : ""}`}
              />
              <img
                src={`${templateURL}/${template.imageLocation}`}
                alt={template.name}
                style={{ maxWidth: 300, maxHeight: 300 }}
                aria-description={template.longerDescription || template.name}
              />
            </div>
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
                Create a Meme Using {template.givenName}
              </button>
            )}
            <div className="bottom">
              <Button onClick={(e) => readAloud(e, template)}>Read Description</Button>
            </div>
          </div>
        ))}
      </div>
    </div >
  );
};


