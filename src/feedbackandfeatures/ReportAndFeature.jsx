function ReportAndFeature() {
  return (
    <>
      <div>
        <h3 className="mb-2 flex gap-2 pl-1 text-2xl">
          <span>Request a Feature</span>
        </h3>
        <label htmlFor="feature" className="mb-2 flex items-center gap-2 pl-1">
          <span>Share any ideas or improvements </span>
          <span className="font-light opacity-60">(optional)</span>
        </label>
        <textarea id="feature" className="min-h-[180px] w-full min-w-0 resize-y rounded-lg border border-transparent bg-(--textarea-bg) p-3 transition-[border-color] duration-150 outline-none focus:border-(--input-focus-border)" placeholder="Enter your message"></textarea>
      </div>

      <div>
        <h3 className="mb-2 flex gap-2 pl-1 text-2xl">
          <span>Report a bug</span>
        </h3>
        <label htmlFor="feature" className="mb-2 flex items-center gap-2 pl-1">
          <span>Tell us if something isn’t working properly</span>
          <span className="font-light opacity-60">(optional)</span>
        </label>
        <textarea id="feature" className="min-h-[100px] w-full min-w-0 resize-y rounded-lg border border-transparent bg-(--textarea-bg) p-3 transition-[border-color] duration-150 outline-none focus:border-(--input-focus-border)" placeholder="Enter your message"></textarea>
      </div>
    </>
  );
}

export default ReportAndFeature;
