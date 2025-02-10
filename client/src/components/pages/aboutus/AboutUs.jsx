import React from "react";

const AboutUs = () => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>About Us</h1>
        <p style={styles.subtitle}>
          Empowering students and institutions with advanced assessment solutions.
        </p>
      </div>

      <div style={styles.content}>
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Who We Are</h2>
          <p style={styles.text}>
          TechPath Scout is more than just a platform;
           it's a community of innovators and educators passionate about empowering students in the field of computer science and engineering. 
           We believe that every student deserves access to cutting-edge resources and insights that simplify complex concepts. 
           Our team is composed of industry experts, educators, and tech enthusiasts united by the goal of transforming education through technology.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>What We Do</h2>
          <p style={styles.text}>
          We specialize in creating customizable and interactive assessments tailored to the needs of CSE students and institutions.
           Our platform delivers in-depth analytics, helping students understand their strengths and areas for improvement. 
           From foundational concepts to advanced topics, TechPath Scout bridges the gap between academic learning and real-world application. 
           Whether you're preparing for competitive exams, sharpening your coding skills, or simply exploring your potential, we’re here to guide you.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Our Vision</h2>
          <p style={styles.text}>
          We envision a world where technology seamlessly integrates into education, making it accessible, engaging, and impactful.
           Our goal is to be the go-to platform for students and educators worldwide, setting new standards in assessment and learning experiences. 
           By fostering a culture of innovation, we aim to unlock limitless possibilities for learners, empowering them to build the future they envision.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Why Choose Us?</h2>
          <ul style={styles.list}>
            <li style={styles.listItem}>Detailed, personalized reports.</li>
            <li style={styles.listItem}>Affordable and transparent pricing.</li>
            <li style={styles.listItem}>User-friendly platform with secure data handling.</li>
            <li style={styles.listItem}>Expert-designed assessments for CSE domains.</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1600px",
    margin: "5% 30%",
    padding: "20px",
    fontFamily: "'Arial', sans-serif",
    color: "#333",
    textAlign: "justify",
  },
  header: {
    textAlign: "center",
    marginBottom: "10%",
    backgroundColor:"beige",
    color:"black",
    borderRadius:"10px",
    width:"100%"
  },
  title: {
    fontSize: "48px",
    fontWeight: "bold",
   
  },
  subtitle: {
    fontSize: "18px",
    color: "#666",
  },
  content: {
    lineHeight: "1.8",
  },
  section: {
    marginBottom: "15%",
  },
  sectionTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  text: {
    fontSize: "16px",
    color: "#555",
  },
  list: {
    marginTop: "40px",
    paddingLeft: "20px",
   
  },
  listItem: {
    marginBottom: "5px",
    fontSize: "16px",
    marginLeft:"0%"
  },
};

export default AboutUs;
