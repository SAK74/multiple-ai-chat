"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [blocks, setBlocks] = useState<string[]>([]);
  useEffect(() => {
    fetch("api").then((resp) => {
      const reader = resp.body
        ?.pipeThrough(new TextDecoderStream())
        .getReader();
      reader?.read().then(function processData({ done, value }) {
        console.log({ done, value });
        if (done) {
          return;
        }
        setBlocks((prev) => {
          if (!prev.length) {
            return [value];
          } else {
            const copied = [...prev];
            copied[copied.length - 1] += value;
            return copied;
          }
        });
        reader.read().then(processData);
      });
    });
  }, []);

  return (
    <div className="h-screen">
      <aside className="float-left border-r h-full">Some aside section</aside>
      <main className="flex flex-col h-full">
        <h1>Hello!</h1>
        <section className="grow">
          {blocks.map((text, i) => (
            <p key={i} className="text-left">
              {text}
            </p>
          ))}
        </section>
        <form>
          <input type="text" placeholder="Start typing here" />
        </form>
      </main>
    </div>
  );
}
