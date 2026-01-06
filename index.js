import { extension_settings, getContext } from "../../../extensions.js";
import { saveSettingsDebounced, eventSource, event_types } from "../../../../script.js";

const extensionName = "cliche-killer";

const defaultBannedItems = [
    { phrase: "flesh", replacement: "skin", enabled: true, lang: "en" },
    { phrase: "shivers down spine", replacement: "a chill through them", enabled: true, lang: "en" },
    { phrase: "shivers ran down", replacement: "a chill ran through", enabled: true, lang: "en" },
    { phrase: "shiver down", replacement: "chill through", enabled: true, lang: "en" },
    { phrase: "testament to", replacement: "proof of", enabled: true, lang: "en" },
    { phrase: "tapestry of", replacement: "layers of", enabled: true, lang: "en" },
    { phrase: "dance of shadows", replacement: "shifting shadows", enabled: true, lang: "en" },
    { phrase: "predatory gaze", replacement: "sharp gaze", enabled: true, lang: "en" },
    { phrase: "predatory smile", replacement: "sharp smile", enabled: true, lang: "en" },
    { phrase: "predatory eyes", replacement: "sharp eyes", enabled: true, lang: "en" },
    { phrase: "predatory look", replacement: "intense look", enabled: true, lang: "en" },
    { phrase: "velvety voice", replacement: "low voice", enabled: true, lang: "en" },
    { phrase: "velvet voice", replacement: "low voice", enabled: true, lang: "en" },
    { phrase: "silky voice", replacement: "smooth voice", enabled: true, lang: "en" },
    { phrase: "hung in the air", replacement: "lingered between them", enabled: true, lang: "en" },
    { phrase: "hung heavy in the air", replacement: "lingered", enabled: true, lang: "en" },
    { phrase: "hanging in the air", replacement: "lingering", enabled: true, lang: "en" },
    { phrase: "smell of ozone", replacement: "sharp scent", enabled: true, lang: "en" },
    { phrase: "scent of ozone", replacement: "sharp scent", enabled: true, lang: "en" },
    { phrase: "ozone", replacement: "electricity", enabled: true, lang: "en" },
    { phrase: "musk", replacement: "warm scent", enabled: true, lang: "en" },
    { phrase: "musky", replacement: "warm", enabled: true, lang: "en" },
    { phrase: "couldn't help but", replacement: "", enabled: true, lang: "en" },
    { phrase: "could not help but", replacement: "", enabled: true, lang: "en" },
    { phrase: "can't help but", replacement: "", enabled: true, lang: "en" },
    { phrase: "you are mine", replacement: "I want you", enabled: true, lang: "en" },
    { phrase: "you're mine", replacement: "I want you", enabled: true, lang: "en" },
    { phrase: "you belong to me", replacement: "I need you", enabled: true, lang: "en" },
    { phrase: "mine and mine alone", replacement: "only for me", enabled: true, lang: "en" },
    { phrase: "air thick with tension", replacement: "heavy silence", enabled: true, lang: "en" },
    { phrase: "air charged with", replacement: "silence filled with", enabled: true, lang: "en" },
    { phrase: "thick with tension", replacement: "tense", enabled: true, lang: "en" },
    { phrase: "electric tension", replacement: "quiet tension", enabled: true, lang: "en" },
    { phrase: "animalistic growl", replacement: "low growl", enabled: true, lang: "en" },
    { phrase: "animalistic sound", replacement: "rough sound", enabled: true, lang: "en" },
    { phrase: "animalistic", replacement: "raw", enabled: true, lang: "en" },
    { phrase: "orbs", replacement: "eyes", enabled: true, lang: "en" },
    { phrase: "digits", replacement: "fingers", enabled: true, lang: "en" },
    { phrase: "ministrations", replacement: "touch", enabled: true, lang: "en" },
    { phrase: "let out a breath", replacement: "exhaled", enabled: true, lang: "en" },
    { phrase: "released a breath", replacement: "exhaled", enabled: true, lang: "en" },
    { phrase: "breath he didn't know", replacement: "breath he'd held", enabled: true, lang: "en" },
    { phrase: "breath she didn't know", replacement: "breath she'd held", enabled: true, lang: "en" },
    { phrase: "breath they didn't know", replacement: "breath they'd held", enabled: true, lang: "en" },
    { phrase: "a mixture of", replacement: "both", enabled: true, lang: "en" },
    { phrase: "mixture of", replacement: "blend of", enabled: true, lang: "en" },
    { phrase: "found themselves", replacement: "ended up", enabled: true, lang: "en" },
    { phrase: "found himself", replacement: "caught himself", enabled: true, lang: "en" },
    { phrase: "found herself", replacement: "caught herself", enabled: true, lang: "en" },
    { phrase: "silence was deafening", replacement: "silence stretched", enabled: true, lang: "en" },
    { phrase: "deafening silence", replacement: "heavy silence", enabled: true, lang: "en" },
    { phrase: "sent shivers", replacement: "made them shudder", enabled: true, lang: "en" },
    { phrase: "pools of", replacement: "deep", enabled: true, lang: "en" },
    { phrase: "drinking in", replacement: "taking in", enabled: true, lang: "en" },
    { phrase: "growled possessively", replacement: "said roughly", enabled: true, lang: "en" },
    { phrase: "claimed his lips", replacement: "kissed him", enabled: true, lang: "en" },
    { phrase: "claimed her lips", replacement: "kissed her", enabled: true, lang: "en" },
    
    { phrase: "плоть", replacement: "кожа", enabled: true, lang: "ru" },
    { phrase: "плоти", replacement: "кожи", enabled: true, lang: "ru" },
    { phrase: "мурашки по спине", replacement: "холодок по коже", enabled: true, lang: "ru" },
    { phrase: "мурашки побежали", replacement: "холодок пробежал", enabled: true, lang: "ru" },
    { phrase: "мурашки пробежали", replacement: "холодок пробежал", enabled: true, lang: "ru" },
    { phrase: "мурашки по коже", replacement: "холодок по телу", enabled: true, lang: "ru" },
    { phrase: "бархатный голос", replacement: "низкий голос", enabled: true, lang: "ru" },
    { phrase: "бархатным голосом", replacement: "низким голосом", enabled: true, lang: "ru" },
    { phrase: "бархатистый голос", replacement: "мягкий голос", enabled: true, lang: "ru" },
    { phrase: "бархатистым голосом", replacement: "мягким голосом", enabled: true, lang: "ru" },
    { phrase: "хищный взгляд", replacement: "острый взгляд", enabled: true, lang: "ru" },
    { phrase: "хищным взглядом", replacement: "острым взглядом", enabled: true, lang: "ru" },
    { phrase: "хищная улыбка", replacement: "острая улыбка", enabled: true, lang: "ru" },
    { phrase: "хищной улыбкой", replacement: "резкой улыбкой", enabled: true, lang: "ru" },
    { phrase: "хищно улыбнулся", replacement: "усмехнулся", enabled: true, lang: "ru" },
    { phrase: "хищно улыбнулась", replacement: "усмехнулась", enabled: true, lang: "ru" },
    { phrase: "хищно", replacement: "резко", enabled: true, lang: "ru" },
    { phrase: "запах озона", replacement: "резкий запах", enabled: true, lang: "ru" },
    { phrase: "озоном", replacement: "свежестью", enabled: true, lang: "ru" },
    { phrase: "озона", replacement: "электричества", enabled: true, lang: "ru" },
    { phrase: "мускус", replacement: "тёплый запах", enabled: true, lang: "ru" },
    { phrase: "мускусный", replacement: "терпкий", enabled: true, lang: "ru" },
    { phrase: "мускусом", replacement: "теплом", enabled: true, lang: "ru" },
    { phrase: "мускуса", replacement: "тепла", enabled: true, lang: "ru" },
    { phrase: "напряжение в воздухе", replacement: "тяжёлая тишина", enabled: true, lang: "ru" },
    { phrase: "напряжение повисло", replacement: "тишина повисла", enabled: true, lang: "ru" },
    { phrase: "напряжение", replacement: "тишина", enabled: false, lang: "ru" },
    { phrase: "повисло в воздухе", replacement: "осталось между ними", enabled: true, lang: "ru" },
    { phrase: "висело в воздухе", replacement: "ощущалось между ними", enabled: true, lang: "ru" },
    { phrase: "тяжело повисло", replacement: "ощущалось", enabled: true, lang: "ru" },
    { phrase: "повисла тишина", replacement: "стало тихо", enabled: true, lang: "ru" },
    { phrase: "ты моя", replacement: "я хочу тебя", enabled: true, lang: "ru" },
    { phrase: "ты мой", replacement: "я хочу тебя", enabled: true, lang: "ru" },
    { phrase: "ты принадлежишь мне", replacement: "ты нужна мне", enabled: true, lang: "ru" },
    { phrase: "принадлежишь мне", replacement: "нужна мне", enabled: true, lang: "ru" },
    { phrase: "моя и только моя", replacement: "только для меня", enabled: true, lang: "ru" },
    { phrase: "мой и только мой", replacement: "только для меня", enabled: true, lang: "ru" },
    { phrase: "якорь", replacement: "опора", enabled: true, lang: "ru" },
    { phrase: "якорем", replacement: "опорой", enabled: true, lang: "ru" },
    { phrase: "якоря", replacement: "опоры", enabled: true, lang: "ru" },
    { phrase: "капитуляция", replacement: "сдача", enabled: true, lang: "ru" },
    { phrase: "капитулировал", replacement: "сдался", enabled: true, lang: "ru" },
    { phrase: "капитулировала", replacement: "сдалась", enabled: true, lang: "ru" },
    { phrase: "что-то другое", replacement: "нечто", enabled: true, lang: "ru" },
    { phrase: "что-то иное", replacement: "нечто", enabled: true, lang: "ru" },
    { phrase: "смесь из", replacement: "сочетание", enabled: true, lang: "ru" },
    { phrase: "коктейль из", replacement: "смешение", enabled: true, lang: "ru" },
    { phrase: "коктейль эмоций", replacement: "волна эмоций", enabled: true, lang: "ru" },
    { phrase: "оглушающая тишина", replacement: "давящая тишина", enabled: true, lang: "ru" },
    { phrase: "звенящая тишина", replacement: "плотная тишина", enabled: true, lang: "ru" },
    { phrase: "оглушительная тишина", replacement: "полная тишина", enabled: true, lang: "ru" },
    { phrase: "не мог не", replacement: "", enabled: true, lang: "ru" },
    { phrase: "не могла не", replacement: "", enabled: true, lang: "ru" },
    { phrase: "не смог не", replacement: "", enabled: true, lang: "ru" },
    { phrase: "не смогла не", replacement: "", enabled: true, lang: "ru" },
    { phrase: "сандал", replacement: "дерево", enabled: true, lang: "ru" },
    { phrase: "сандала", replacement: "дерева", enabled: true, lang: "ru" },
    { phrase: "сандалом", replacement: "деревом", enabled: true, lang: "ru" },
    { phrase: "рычание", replacement: "низкий звук", enabled: true, lang: "ru" },
    { phrase: "зарычал", replacement: "произнёс низко", enabled: true, lang: "ru" },
    { phrase: "зарычала", replacement: "произнесла низко", enabled: true, lang: "ru" },
    { phrase: "прорычал", replacement: "процедил", enabled: true, lang: "ru" },
    { phrase: "прорычала", replacement: "процедила", enabled: true, lang: "ru" },
];


const defaultSettings = {
    enabled: true,
    bannedItems: defaultBannedItems,
    useLogitBias: false, 
    logitBiasStrength: -100,
    showNotifications: true,
    notificationStyle: "toast", 
    caseSensitive: false,
    filterLang: "all", 
};


let sessionStats = {
    totalReplacements: 0,
    phrasesReplaced: {},
};


function loadSettings() {
    extension_settings[extensionName] = extension_settings[extensionName] || {};
    
    for (const [key, value] of Object.entries(defaultSettings)) {
        if (extension_settings[extensionName][key] === undefined) {
            extension_settings[extensionName][key] = JSON.parse(JSON.stringify(value));
        }
    }
}


function getSettings() {
    return extension_settings[extensionName];
}


function processText(text) {
    if (!getSettings().enabled) return { text, count: 0, details: [] };
    
    let processedText = text;
    let totalCount = 0;
    const details = [];
    const filterLang = getSettings().filterLang;
    const caseSensitive = getSettings().caseSensitive;
    
    for (const item of getSettings().bannedItems) {
        if (!item.enabled) continue;
        if (filterLang !== "all" && item.lang !== filterLang) continue;
        

        const escaped = item.phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const flags = caseSensitive ? 'g' : 'gi';
        const regex = new RegExp(`\\b${escaped}\\b`, flags);
        
        const matches = processedText.match(regex);
        if (matches && matches.length > 0) {
            totalCount += matches.length;
            details.push({ phrase: item.phrase, replacement: item.replacement, count: matches.length });
            processedText = processedText.replace(regex, item.replacement);
            

            sessionStats.totalReplacements += matches.length;
            sessionStats.phrasesReplaced[item.phrase] = (sessionStats.phrasesReplaced[item.phrase] || 0) + matches.length;
        }
    }
    
    return { text: processedText, count: totalCount, details };
}


function getLogitBias() {
    if (!getSettings().useLogitBias) return null;
    
    const bias = {};
    const strength = getSettings().logitBiasStrength;
    
    for (const item of getSettings().bannedItems) {
        if (!item.enabled) continue;
        

        const words = item.phrase.toLowerCase().split(' ');
        if (words.length === 1 && words[0].length > 2) {
            bias[words[0]] = strength;
        }
    }
    
    return Object.keys(bias).length > 0 ? bias : null;
}

function notify(count, details) {
    const style = getSettings().notificationStyle;
    
    if (style === "none" || count === 0) return;
    
    const message = `Cliché Killer: ${count} replacement(s)`;
    
    if (style === "toast" && typeof toastr !== 'undefined') {
        const detailText = details.map(d => `"${d.phrase}" → "${d.replacement || '∅'}" (${d.count})`).join('\n');
        toastr.info(detailText, message, { timeOut: 3000 });
    } else {
        console.log(`[Cliché Killer] ${message}`, details);
    }
}


function onMessageReceived(data) {
    if (!getSettings().enabled) return;
    if (!data.message) return;
    
    const result = processText(data.message);
    
    if (result.count > 0) {
        data.message = result.text;
        
        if (getSettings().showNotifications) {
            notify(result.count, result.details);
        }
    }
}

function onGenerateParams(params) {
    if (!getSettings().enabled) return;
    
    const bias = getLogitBias();
    if (bias) {
        params.logit_bias = { ...params.logit_bias, ...bias };
    }
}


function addPhrase(phrase, replacement, lang = "en") {
    if (!phrase || !phrase.trim()) return false;
    
    const newItem = {
        phrase: phrase.trim().toLowerCase(),
        replacement: replacement.trim(),
        enabled: true,
        lang: lang
    };
    

    const exists = getSettings().bannedItems.some(i => i.phrase.toLowerCase() === newItem.phrase);
    if (exists) {
        toastr.warning(`"${phrase}" already exists`);
        return false;
    }
    
    getSettings().bannedItems.push(newItem);
    saveSettingsDebounced();
    return true;
}


function removePhrase(index) {
    getSettings().bannedItems.splice(index, 1);
    saveSettingsDebounced();
}


function togglePhrase(index, enabled) {
    getSettings().bannedItems[index].enabled = enabled;
    saveSettingsDebounced();
}

function editPhrase(index, phrase, replacement) {
    getSettings().bannedItems[index].phrase = phrase;
    getSettings().bannedItems[index].replacement = replacement;
    saveSettingsDebounced();
}


function exportPhrases() {
    const data = JSON.stringify(getSettings().bannedItems, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cliche-killer-phrases-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
}


function importPhrases(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                if (!Array.isArray(imported)) throw new Error("Invalid format");
                
                let added = 0;
                for (const item of imported) {
                    if (item.phrase && typeof item.phrase === 'string') {
                        const exists = getSettings().bannedItems.some(i => 
                            i.phrase.toLowerCase() === item.phrase.toLowerCase()
                        );
                        if (!exists) {
                            getSettings().bannedItems.push({
                                phrase: item.phrase,
                                replacement: item.replacement || "",
                                enabled: item.enabled !== false,
                                lang: item.lang || "en"
                            });
                            added++;
                        }
                    }
                }
                
                saveSettingsDebounced();
                resolve(added);
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = reject;
        reader.readAsText(file);
    });
}


function resetToDefaults() {
    extension_settings[extensionName].bannedItems = JSON.parse(JSON.stringify(defaultBannedItems));
    saveSettingsDebounced();
}


function renderUI() {
    const html = `
    <div id="cliche-killer-panel">
        <div class="inline-drawer">
            <div class="inline-drawer-toggle inline-drawer-header">
                <b>Cliché Killer</b>
                <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
            </div>
            <div class="inline-drawer-content">
                
                <!-- Main Toggle -->
                <div class="ck-row">
                    <label class="checkbox_label">
                        <input type="checkbox" id="ck-enabled">
                        <span>Enable Cliché Killer</span>
                    </label>
                </div>
                
                <!-- Stats -->
                <div class="ck-stats">
                    Session: <span id="ck-stats-count">0</span> replacements
                </div>
                
                <hr>
                
                <!-- Settings -->
                <details class="ck-section">
                    <summary>⚙️ Settings</summary>
                    <div class="ck-section-content">
                        
                        <div class="ck-row">
                            <label class="checkbox_label">
                                <input type="checkbox" id="ck-notifications">
                                <span>Show notifications</span>
                            </label>
                        </div>
                        
                        <div class="ck-row">
                            <label>Filter language:</label>
                            <select id="ck-filter-lang">
                                <option value="all">All</option>
                                <option value="en">English only</option>
                                <option value="ru">Russian only</option>
                            </select>
                        </div>
                        
                        <div class="ck-row">
                            <label class="checkbox_label">
                                <input type="checkbox" id="ck-logit-bias">
                                <span>Use Logit Bias (experimental)</span>
                            </label>
                        </div>
                        <div class="ck-hint">Only works with OpenAI, KoboldAI, llama.cpp. Single words only.</div>
                        
                        <div class="ck-row" id="ck-bias-row">
                            <label>Bias strength: <span id="ck-bias-value">-100</span></label>
                            <input type="range" id="ck-bias-strength" min="-100" max="-10" value="-100">
                        </div>
                        
                    </div>
                </details>
                
                <hr>
                
                <!-- Add New Phrase -->
                <details class="ck-section" open>
                    <summary>➕ Add New Phrase</summary>
                    <div class="ck-section-content">
                        
                        <div class="ck-add-form">
                            <input type="text" id="ck-new-phrase" placeholder="Word or phrase to ban">
                            <input type="text" id="ck-new-replacement" placeholder="Replacement (empty = delete)">
                            <select id="ck-new-lang">
                                <option value="en">EN</option>
                                <option value="ru">RU</option>
                            </select>
                            <button id="ck-add-btn" class="menu_button">Add</button>
                        </div>
                        
                        <div class="ck-hint">
                            Examples: "flesh" → "skin", "ты моя" → "я хочу тебя"
                        </div>
                        
                    </div>
                </details>
                
                <hr>
                
                <!-- Phrase List -->
                <details class="ck-section">
                    <summary>📋 Banned Phrases (<span id="ck-count">0</span>)</summary>
                    <div class="ck-section-content">
                        
                        <div class="ck-search-row">
                            <input type="text" id="ck-search" placeholder="Search phrases...">
                        </div>
                        
                        <div id="ck-phrase-list" class="ck-list">
                            <!-- Populated by JS -->
                        </div>
                        
                    </div>
                </details>
                
                <hr>
                
                <!-- Import/Export -->
                <div class="ck-buttons">
                    <button id="ck-export-btn" class="menu_button">📤 Export</button>
                    <button id="ck-import-btn" class="menu_button">📥 Import</button>
                    <button id="ck-reset-btn" class="menu_button">🔄 Reset</button>
                    <input type="file" id="ck-import-file" accept=".json" style="display:none">
                </div>
                
            </div>
        </div>
    </div>
    
    <style>
        #cliche-killer-panel .ck-row {
            margin: 8px 0;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        #cliche-killer-panel .ck-stats {
            font-size: 12px;
            opacity: 0.8;
            padding: 5px;
            background: rgba(100,100,100,0.1);
            border-radius: 4px;
            margin: 8px 0;
        }
        #cliche-killer-panel .ck-section {
            margin: 5px 0;
        }
        #cliche-killer-panel .ck-section summary {
            cursor: pointer;
            padding: 5px;
            font-weight: bold;
        }
        #cliche-killer-panel .ck-section-content {
            padding: 10px;
            background: rgba(100,100,100,0.05);
            border-radius: 4px;
            margin-top: 5px;
        }
        #cliche-killer-panel .ck-hint {
            font-size: 11px;
            opacity: 0.6;
            margin: 5px 0;
        }
        #cliche-killer-panel .ck-add-form {
            display: flex;
            gap: 5px;
            flex-wrap: wrap;
        }
        #cliche-killer-panel .ck-add-form input[type="text"] {
            flex: 1;
            min-width: 120px;
        }
        #cliche-killer-panel .ck-search-row {
            margin-bottom: 10px;
        }
        #cliche-killer-panel .ck-search-row input {
            width: 100%;
        }
        #cliche-killer-panel .ck-list {
            max-height: 400px;
            overflow-y: auto;
            border: 1px solid var(--SmartThemeBorderColor);
            border-radius: 4px;
        }
        #cliche-killer-panel .ck-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 6px 8px;
            border-bottom: 1px solid var(--SmartThemeBorderColor);
            font-size: 13px;
        }
        #cliche-killer-panel .ck-item:last-child {
            border-bottom: none;
        }
        #cliche-killer-panel .ck-item:hover {
            background: rgba(100,100,100,0.1);
        }
        #cliche-killer-panel .ck-item.disabled {
            opacity: 0.5;
        }
        #cliche-killer-panel .ck-item .phrase {
            flex: 1;
            font-family: monospace;
            word-break: break-word;
        }
        #cliche-killer-panel .ck-item .arrow {
            opacity: 0.5;
        }
        #cliche-killer-panel .ck-item .replacement {
            flex: 1;
            font-family: monospace;
            color: var(--SmartThemeQuoteColor);
            word-break: break-word;
        }
        #cliche-killer-panel .ck-item .lang-badge {
            font-size: 10px;
            padding: 2px 5px;
            border-radius: 3px;
            background: var(--SmartThemeBorderColor);
            text-transform: uppercase;
        }
        #cliche-killer-panel .ck-item .delete-btn {
            cursor: pointer;
            opacity: 0.6;
            transition: opacity 0.2s;
        }
        #cliche-killer-panel .ck-item .delete-btn:hover {
            opacity: 1;
            color: #ff6b6b;
        }
        #cliche-killer-panel .ck-buttons {
            display: flex;
            gap: 5px;
            flex-wrap: wrap;
        }
        #cliche-killer-panel .ck-buttons button {
            flex: 1;
            min-width: 80px;
        }
        #cliche-killer-panel hr {
            border: none;
            border-top: 1px solid var(--SmartThemeBorderColor);
            margin: 10px 0;
        }
    </style>
    `;
    
    $('#extensions_settings').append(html);
    bindEvents();
    updateUI();
}


function bindEvents() {

    $('#ck-enabled').on('change', function() {
        getSettings().enabled = this.checked;
        saveSettingsDebounced();
        updateUI();
    });
    

    $('#ck-notifications').on('change', function() {
        getSettings().showNotifications = this.checked;
        saveSettingsDebounced();
    });
    

    $('#ck-filter-lang').on('change', function() {
        getSettings().filterLang = this.value;
        saveSettingsDebounced();
        renderPhraseList();
    });
    

    $('#ck-logit-bias').on('change', function() {
        getSettings().useLogitBias = this.checked;
        saveSettingsDebounced();
        $('#ck-bias-row').toggle(this.checked);
    });
    

    $('#ck-bias-strength').on('input', function() {
        getSettings().logitBiasStrength = parseInt(this.value);
        $('#ck-bias-value').text(this.value);
        saveSettingsDebounced();
    });
    

    $('#ck-add-btn').on('click', function() {
        const phrase = $('#ck-new-phrase').val();
        const replacement = $('#ck-new-replacement').val();
        const lang = $('#ck-new-lang').val();
        
        if (addPhrase(phrase, replacement, lang)) {
            $('#ck-new-phrase').val('');
            $('#ck-new-replacement').val('');
            renderPhraseList();
            toastr.success(`Added: "${phrase}"`);
        }
    });
    
    $('#ck-new-phrase, #ck-new-replacement').on('keypress', function(e) {
        if (e.key === 'Enter') {
            $('#ck-add-btn').click();
        }
    });
    

    $('#ck-search').on('input', function() {
        renderPhraseList(this.value);
    });
    

    $('#ck-export-btn').on('click', exportPhrases);
    

    $('#ck-import-btn').on('click', () => $('#ck-import-file').click());
    $('#ck-import-file').on('change', async function() {
        if (this.files[0]) {
            try {
                const count = await importPhrases(this.files[0]);
                toastr.success(`Imported ${count} new phrases`);
                renderPhraseList();
            } catch (err) {
                toastr.error('Import failed: ' + err.message);
            }
            this.value = '';
        }
    });
    

    $('#ck-reset-btn').on('click', function() {
        if (confirm('Reset all phrases to defaults? Your custom phrases will be lost.')) {
            resetToDefaults();
            renderPhraseList();
            toastr.info('Reset to defaults');
        }
    });
}


function updateUI() {
    const s = getSettings();
    
    $('#ck-enabled').prop('checked', s.enabled);
    $('#ck-notifications').prop('checked', s.showNotifications);
    $('#ck-filter-lang').val(s.filterLang);
    $('#ck-logit-bias').prop('checked', s.useLogitBias);
    $('#ck-bias-strength').val(s.logitBiasStrength);
    $('#ck-bias-value').text(s.logitBiasStrength);
    $('#ck-bias-row').toggle(s.useLogitBias);
    $('#ck-stats-count').text(sessionStats.totalReplacements);
    
    renderPhraseList();
}


function renderPhraseList(search = '') {
    const list = $('#ck-phrase-list');
    const items = getSettings().bannedItems;
    const filterLang = getSettings().filterLang;
    const searchLower = search.toLowerCase();
    
    list.empty();
    
    let visibleCount = 0;
    
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        

        if (filterLang !== 'all' && item.lang !== filterLang) continue;
        

        if (searchLower && !item.phrase.toLowerCase().includes(searchLower) && 
            !item.replacement.toLowerCase().includes(searchLower)) continue;
        
        visibleCount++;
        
        const itemHtml = `
            <div class="ck-item ${item.enabled ? '' : 'disabled'}" data-index="${i}">
                <input type="checkbox" class="ck-toggle" ${item.enabled ? 'checked' : ''}>
                <span class="phrase">${escapeHtml(item.phrase)}</span>
                <span class="arrow">→</span>
                <span class="replacement">${item.replacement ? escapeHtml(item.replacement) : '<i>(delete)</i>'}</span>
                <span class="lang-badge">${item.lang}</span>
                <span class="delete-btn fa-solid fa-xmark"></span>
            </div>
        `;
        list.append(itemHtml);
    }
    
    // Update count
    const enabledCount = items.filter(i => i.enabled).length;
    $('#ck-count').text(`${enabledCount}/${items.length}`);
    

    list.find('.ck-toggle').on('change', function() {
        const index = $(this).closest('.ck-item').data('index');
        togglePhrase(index, this.checked);
        $(this).closest('.ck-item').toggleClass('disabled', !this.checked);
        $('#ck-count').text(`${getSettings().bannedItems.filter(i => i.enabled).length}/${getSettings().bannedItems.length}`);
    });
    
    list.find('.delete-btn').on('click', function() {
        const index = $(this).closest('.ck-item').data('index');
        const phrase = getSettings().bannedItems[index].phrase;
        if (confirm(`Delete "${phrase}"?`)) {
            removePhrase(index);
            renderPhraseList($('#ck-search').val());
        }
    });
}


function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}


setInterval(() => {
    $('#ck-stats-count').text(sessionStats.totalReplacements);
}, 5000);


jQuery(async () => {
    loadSettings();
    renderUI();
    
    eventSource.on(event_types.MESSAGE_RECEIVED, onMessageReceived);
    eventSource.on(event_types.GENERATE_BEFORE_COMBINE_PROMPTS, onGenerateParams);
    
    console.log('[Cliché Killer] v2.0 loaded');
});

window.ClicheKiller = {
    addPhrase,
    removePhrase,
    processText,
    getStats: () => sessionStats,
    resetStats: () => { sessionStats = { totalReplacements: 0, phrasesReplaced: {} }; }
};
