import { Finish, Icon } from "@/components/icons"
import { MainFooter } from "@/components/main-footer"
import { Button } from "@/components/ui/button"
import { AppContext } from "@/context/app-context"
import { useContext, useEffect } from "react"

function FinishPopup() {
  const { treeData } = useContext(AppContext)

  useEffect(() => {
    // 创建监听器函数
    const filenameListener = (downloadItem: chrome.downloads.DownloadItem, suggest: (suggestion?: chrome.downloads.DownloadFilenameSuggestion) => void) => {
      if (downloadItem.url.startsWith('blob:')) {
        suggest({
          filename: 'pintree.json',
          conflictAction: 'prompt'
        })
      }
    }
    // 添加监听器
    chrome.downloads.onDeterminingFilename.addListener(filenameListener)
    // 清理函数
    return () => {
      chrome.downloads.onDeterminingFilename.removeListener(filenameListener)
    }
  }, [])

  // 点击导出按钮后，将数据处理为 JSON 格式
  const onDownload = () => {
    const data = JSON.stringify(treeData, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    chrome.downloads.download({
      url: url,
      saveAs: true
    }, () => {
      URL.revokeObjectURL(url)
    })
  }

  return (
    <div className="py-6 w-[300px] flex flex-col items-center justify-center">
      <Finish className="w-32 h-32" />
      <div className="w-full space-y-3 mt-4 mb-9 px-6">
        <h1 className="text-xl font-normal text-center">Export Successful !</h1>
        <p className="text-lg font-light text-zinc-600 text-center">
          Click the button to download the json file
        </p>
      </div>

      <div className="w-full space-y-5 px-10">
        <Button
          className="text-[16px] font-light w-full py-4 flex items-center justify-center"
          onClick={() => onDownload()}>
          <Icon
            icon="material-symbols:download-sharp"
            className="w-6 h-6 mr-2"
          />
          Download
        </Button>
        <MainFooter />
      </div>
    </div>
  )
}

export default FinishPopup
