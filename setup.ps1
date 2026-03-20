$ErrorActionPreference = "Stop"
npx -y create-next-app@latest quiz-agent --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --no-git --no-turbo --src-dir
Move-Item quiz-agent\* . -Force
Move-Item quiz-agent\.* . -Force
Remove-Item quiz-agent -Recurse -Force
npm install framer-motion clsx tailwind-merge lucide-react
