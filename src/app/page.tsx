"use client";

import {
  FormEventHandler,
  ReactNode,
  Ref,
  RefCallback,
  useEffect,
  useState,
} from "react";

export default function Home() {
  const [blocks, setBlocks] = useState<ReactNode[]>([]);
  // const [responseBlock, setResponseBlock] = useState("");
  // useEffect(() => {
  //   // fetch("api").then((resp) => {
  //   //   const reader = resp.body
  //   //     ?.pipeThrough(new TextDecoderStream())
  //   //     .getReader();
  //   //   reader?.read().then(function processData({ done, value }) {
  //   //     console.log({ done, value });
  //   //     if (done) {
  //   //       return;
  //   //     }
  //   //     setBlocks((prev) => {
  //   //       if (!prev.length) {
  //   //         return [value];
  //   //       } else {
  //   //         const copied = [...prev];
  //   //         copied[copied.length - 1] += value;
  //   //         return copied;
  //   //       }
  //   //     });
  //   //     reader.read().then(processData);
  //   //   });
  //   // });
  // }, []);

  const inputRef: RefCallback<HTMLInputElement> = (input) => {
    input?.focus();
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (ev) => {
    ev.preventDefault();
    // todo: desactivate input element
    const inputEl = ev.currentTarget["input"] as HTMLInputElement;
    const inputText = inputEl.value;
    inputEl.value = "";
    setBlocks((prev) => {
      const copy = [...prev];
      copy.push(
        inputText,
        <span className="text-red-300 text-lg">Loading</span>
      );
      return copy;
    });
    fetch("api", {
      method: "POST",
      body: inputText,
    }).then((resp) => {
      setBlocks((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = "";
        return copy;
      });
      const reader = resp.body
        ?.pipeThrough(new TextDecoderStream())
        .getReader();
      reader?.read().then(function processData({ done, value }) {
        console.log({ done, value });
        if (done) {
          // todo: clear and acticate input element
          return;
        }
        setBlocks((prev) => {
          if (!prev.length) {
            return [value];
          } else {
            const copied = [...prev];
            // copied.push("");
            copied[copied.length - 1] += value;
            return copied;
          }
        });
        // setResponseBlock(prev=>prev.concat(value))
        reader.read().then(processData);
      });
    });
  };

  return (
    <div className="h-screen">
      <aside className="float-left border-r h-full">Some aside section</aside>
      <main className="flex flex-col h-full">
        <h1>Hello!</h1>
        <section className="grow">
          {blocks.map((text, i) => (
            <p key={i} className="text-left border rounded">
              {text}
            </p>
          ))}
        </section>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Start typing here"
            name="input"
            ref={inputRef}
          />
          <button
            type="button"
            onClick={() => {
              setBlocks([]);
            }}
          >
            Clear
          </button>
        </form>
      </main>
    </div>
  );
}
