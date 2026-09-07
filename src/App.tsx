/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams } from "react-router-dom";
import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import Home from "./pages/Home";
import About from "./pages/About";
import Notes from "./pages/Notes";
import Weekly from "./pages/Weekly";
import Builds from "./pages/Builds";
import NotePost from "./pages/NotePost";
import Tech from "./pages/Tech";
import TechDigest from "./pages/TechDigest";
import WorkWithMe from "./pages/WorkWithMe";
import CaseStudy from "./pages/CaseStudy";

function TechRedirect() {
  const { date } = useParams<{ date: string }>();
  return <Navigate to={`/tech-roundup/${date}`} replace />;
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      // Wait a tick so the target section has mounted, then scroll to it.
      const id = hash.slice(1);
      const t = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
        else window.scrollTo(0, 0);
      }, 60);
      return () => clearTimeout(t);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/weekly" element={<Weekly />} />
        <Route path="/builds" element={<Builds />} />
        <Route path="/notes/:slug" element={<NotePost />} />
        <Route path="/tech-roundup" element={<Tech />} />
        <Route path="/tech-roundup/:date" element={<TechDigest />} />
        <Route path="/work-with-me" element={<WorkWithMe />} />
        <Route path="/case-study/:slug" element={<CaseStudy />} />
        {/* Common aliases people type or link — all land on the services page */}
        <Route path="/hire" element={<Navigate to="/work-with-me" replace />} />
        <Route path="/consulting" element={<Navigate to="/work-with-me" replace />} />
        <Route path="/newsletter" element={<Navigate to="/weekly" replace />} />
        {/* Legacy /tech paths redirect to the new slug */}
        <Route path="/tech" element={<Navigate to="/tech-roundup" replace />} />
        <Route path="/tech/:date" element={<TechRedirect />} />
        {/* Requested alias — /portfolio redirects to the re-homed portfolio */}
        <Route path="/portfolio" element={<Navigate to="/about" replace />} />
        {/* Unknown routes fall back to the hub */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  );
}
