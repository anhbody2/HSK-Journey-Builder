import React, { useState } from 'react';

export default function AddLessonPage() {
  const [title, setTitle] = useState('');
  const [level, setLevel] = useState('HSK 1');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ title, level, content });
    alert('Bấm thêm bài học thành công! (Dữ liệu log ở console)');
  };

  return (
    <div className="p-8 max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-xl shadow-xl mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center text-emerald-400 tracking-wide">
        Tạo Bài Học Mới
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Tên bài học:</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2.5 rounded-lg bg-zinc-850 border border-zinc-700 text-zinc-100 !text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            placeholder="Nhập tên bài học..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Cấp độ HSK:</label>
          <select 
            value={level} 
            onChange={(e) => setLevel(e.target.value)}
            className="w-full p-2.5 rounded-lg bg-zinc-850 border border-zinc-700 text-zinc-100 !text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
          >
            <option value="HSK 1" className="bg-zinc-800 text-zinc-100">HSK 1</option>
            <option value="HSK 2" className="bg-zinc-800 text-zinc-100">HSK 2</option>
            <option value="HSK 3" className="bg-zinc-800 text-zinc-100">HSK 3</option>
            <option value="HSK 4" className="bg-zinc-800 text-zinc-100">HSK 4</option>
            <option value="HSK 5" className="bg-zinc-800 text-zinc-100">HSK 5</option>
            <option value="HSK 6" className="bg-zinc-800 text-zinc-100">HSK 6</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Nội dung chi tiết bài học:</label>
          <textarea 
            value={content} 
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2.5 h-36 rounded-lg bg-zinc-850 border border-zinc-700 text-zinc-100 !text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all resize-none"
            placeholder="Nhập nội dung từ vựng, pinyin hoặc ngữ pháp..."
            required
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold py-2.5 px-4 rounded-lg shadow-lg hover:shadow-emerald-500/20 transition-all mt-2 cursor-pointer"
        >
          Thêm Bài Học Vào Hệ Thống
        </button>
      </form>
    </div>
  );
}