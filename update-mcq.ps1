# PowerShell script to update all MCQ pages to use QuizManager
$mcqFiles = Get-ChildItem -Path . -Recurse -Name "mcq.html" | Where-Object { $_ -notlike "*_site*" }

foreach ($file in $mcqFiles) {
    $fullPath = Join-Path (Get-Location) $file
    $content = Get-Content $fullPath -Raw
    
    # Skip if already updated (contains quiz-manager.js)
    if ($content -like "*quiz-manager.js*") {
        Write-Host "Skipping already updated: $file"
        continue
    }
    
    # Extract chapter info from path
    $pathParts = $file -split [regex]::Escape([System.IO.Path]::DirectorySeparatorChar)
    $topic = $pathParts[0]
    $chapter = $pathParts[1]
    
    # Determine chapter details
    $chapterTitle = "Content"
    $topicName = "Physics"
    $topicLink = "foundations.html"
    $jsonFile = "default-quiz.json"
    
    switch ($topic) {
        "mechanics" { 
            $topicName = "Classical Mechanics"
            $topicLink = "foundations.html"
            switch ($chapter) {
                "chapter3" { $chapterTitle = "Force and Newton's Laws"; $jsonFile = "chapter3-force-newton.json" }
                "chapter4" { $chapterTitle = "2D Kinematics"; $jsonFile = "chapter4-2d-kinematics.json" }
                "chapter5" { $chapterTitle = "Applications of Newton's Laws"; $jsonFile = "chapter5-dynamics.json" }
                default { $chapterTitle = "Mechanics Chapter"; $jsonFile = "mechanics-quiz.json" }
            }
        }
        "thermodynamics" { 
            $topicName = "Thermodynamics"
            $topicLink = "thermodynamics.html"
            $chapterTitle = "Thermodynamics"
            $jsonFile = "thermodynamics-quiz.json"
        }
        "electromagnetism" { 
            $topicName = "Electromagnetism"
            $topicLink = "electromagnetism.html"
            $chapterTitle = "Electromagnetism"
            $jsonFile = "electromagnetism-quiz.json"
        }
        "waves" { 
            $topicName = "Waves"
            $topicLink = "waves.html"
            $chapterTitle = "Waves"
            $jsonFile = "waves-quiz.json"
        }
        "optics" { 
            $topicName = "Optics"
            $topicLink = "optics.html"
            $chapterTitle = "Optics"
            $jsonFile = "optics-quiz.json"
        }
        "modern" { 
            $topicName = "Modern Physics"
            $topicLink = "modern.html"
            $chapterTitle = "Modern Physics"
            $jsonFile = "modern-quiz.json"
        }
    }
    
    # Read template and replace placeholders
    $template = Get-Content "mcq-template.html" -Raw
    $updatedContent = $template -replace "{{CHAPTER_TITLE}}", $chapterTitle
    $updatedContent = $updatedContent -replace "{{CHAPTER_NUM}}", "Chapter $($chapter -replace 'chapter', '')"
    $updatedContent = $updatedContent -replace "{{TOPIC_NAME}}", $topicName
    $updatedContent = $updatedContent -replace "{{TOPIC_LINK}}", $topicLink
    $updatedContent = $updatedContent -replace "{{JSON_FILE}}", $jsonFile
    
    # Write updated content
    Set-Content -Path $fullPath -Value $updatedContent -Encoding UTF8
    Write-Host "Updated: $file -> $chapterTitle"
}

Write-Host "MCQ update completed!"
