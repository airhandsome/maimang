'use client';

export default function AdminTestPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">布局测试页面</h1>
        <p className="text-gray-600 mb-4">这个页面用于测试管理员布局是否正确工作。</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold text-yellow-800">测试卡片 1</h3>
            <p className="text-yellow-600 text-sm">这是第一个测试卡片</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800">测试卡片 2</h3>
            <p className="text-blue-600 text-sm">这是第二个测试卡片</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800">测试卡片 3</h3>
            <p className="text-green-600 text-sm">这是第三个测试卡片</p>
          </div>
        </div>
        
        <div className="mt-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">滚动测试 - 侧边栏应该始终固定在左侧</h2>
          <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
            <p className="text-yellow-800 font-medium">
              ⚠️ 重要提示：滚动此页面时，左侧的侧边栏应该始终保持在视口左侧，不会随着页面内容滚动而移动。
              底部的退出按钮应该始终可见并固定在侧边栏底部。
            </p>
          </div>
          {Array.from({ length: 30 }, (_, i) => (
            <div key={i} className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700">测试项目 {i + 1}</h3>
              <p className="text-gray-500 text-sm">
                这是第 {i + 1} 个测试项目，用于测试页面滚动时侧边栏是否保持固定位置。
                侧边栏应该始终固定在视口左侧，高度为100vh，不会随着页面内容滚动。
                当页面内容很长时，只有右侧的主内容区域会滚动，左侧的侧边栏应该保持不动。
              </p>
              <div className="mt-2 text-xs text-gray-400">
                当前项目高度: {Math.floor(Math.random() * 100) + 50}px
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}