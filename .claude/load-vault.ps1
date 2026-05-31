# Auto-loads the InvitationCard Obsidian vault's key notes into the session at
# SessionStart, so any agent has the project's "second brain" before doing work.
# Emits a SessionStart hook JSON payload whose additionalContext is injected into
# the model's context. Fails soft: prints nothing if the vault is missing.

$ErrorActionPreference = 'Stop'

$vault = 'C:\Users\Theo Cedric Chan\Documents\Obsidian Vault\InvitationCard Vault'
$notes = @('Agent Handoff.md', 'UI Gotchas & Lessons.md')

try {
    $sb = [System.Text.StringBuilder]::new()
    [void]$sb.AppendLine('# MANDATORY PROJECT CONTEXT - InvitationCard vault (auto-loaded at session start)')
    [void]$sb.AppendLine('')
    [void]$sb.AppendLine('You are working in the InvitationCard project (a christening invitation website).')
    [void]$sb.AppendLine('You MUST read and follow the vault notes below BEFORE writing, editing, or running any code, or answering questions about the project.')
    [void]$sb.AppendLine(('Full vault (open other notes from Home.md as needed): {0}' -f $vault))
    [void]$sb.AppendLine('')

    foreach ($note in $notes) {
        $path = Join-Path $vault $note
        if (Test-Path -LiteralPath $path) {
            [void]$sb.AppendLine(('===================== {0} =====================' -f $note))
            [void]$sb.AppendLine((Get-Content -LiteralPath $path -Raw))
            [void]$sb.AppendLine('')
        }
    }

    $payload = @{
        hookSpecificOutput = @{
            hookEventName     = 'SessionStart'
            additionalContext = $sb.ToString()
        }
    }

    $payload | ConvertTo-Json -Depth 5 -Compress
}
catch {
    # Never block a session over a context-loading helper.
    exit 0
}
