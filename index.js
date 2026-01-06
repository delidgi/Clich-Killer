/*
 * Cliché Killer v3.0 - Smart Edition
 * Auto-picks replacements from variants + optional AI rewrite
 */

import { extension_settings, getContext } from "../../../extensions.js";
import { saveSettingsDebounced, eventSource, event_types, generateQuietPrompt } from "../../../../script.js";

const extensionName = "cliche-killer";

// ============================================
// SMART REPLACEMENT DATABASE
// Each banned word/phrase has multiple replacement options
// ============================================

const smartDatabase = {
    // ===== ENGLISH =====
    
    // Voice/sound verbs
    "growled": ["said roughly", "muttered", "said low", "ground out"],
    "purred": ["said softly", "murmured", "hummed"],
    "hissed": ["whispered sharply", "said through teeth", "snapped quietly"],
    "rumbled": ["said deeply", "replied low", "muttered"],
    "snarled": ["snapped", "said harshly", "bit out"],
    
    // Predatory
    "predatory gaze": ["sharp gaze", "intense look", "focused stare", "hard eyes"],
    "predatory smile": ["sharp smile", "knowing smile", "slow smile", "thin smile"],
    "predatory eyes": ["sharp eyes", "keen eyes", "hard eyes", "watchful eyes"],
    "predatory": ["sharp", "intense", "keen", "focused"],
    
    // Body clichés
    "flesh": ["skin", "body", "warmth"],
    "orbs": ["eyes"],
    "digits": ["fingers"],
    "ministrations": ["touch", "hands", "attention"],
    "pools of": ["deep", "dark"],
    
    // Shivers/tension
    "shivers down spine": ["chill through them", "shudder", "goosebumps"],
    "shivers ran down": ["chill ran through", "shudder passed through"],
    "sent shivers": ["made them shudder", "sent a chill"],
    "electric tension": ["quiet tension", "thick silence", "charged silence"],
    "air thick with tension": ["heavy silence", "tense quiet", "strained silence"],
    "air charged with": ["silence filled with", "atmosphere heavy with"],
    "hung in the air": ["lingered", "stayed between them", "remained unspoken"],
    "hung heavy": ["lingered", "weighed", "stayed"],
    "deafening silence": ["heavy silence", "thick silence", "long silence"],
    
    // Smell clichés
    "smell of ozone": ["sharp scent", "electric smell", "crisp scent"],
    "scent of ozone": ["sharp scent", "metallic tang"],
    "ozone": ["electricity", "static"],
    "musk": ["warm scent", "his smell", "familiar scent"],
    "musky": ["warm", "rich", "earthy"],
    
    // Voice descriptions
    "velvety voice": ["low voice", "smooth voice", "deep voice", "soft voice"],
    "velvet voice": ["low voice", "rich voice", "warm voice"],
    "silky voice": ["smooth voice", "soft voice", "gentle voice"],
    
    // Possessive
    "you are mine": ["I want you", "I need you", "you're with me"],
    "you're mine": ["I want you", "I need you", "stay with me"],
    "you belong to me": ["I need you", "I want you here", "stay"],
    "mine and mine alone": ["only with me", "just mine", "for me"],
    
    // Overused phrases
    "couldn't help but": ["simply", "just", ""],
    "could not help but": ["simply", "just", ""],
    "can't help but": ["just", ""],
    "testament to": ["proof of", "sign of", "showed"],
    "tapestry of": ["layers of", "mix of", "web of"],
    "dance of shadows": ["shifting shadows", "moving shadows", "shadow play"],
    "found themselves": ["ended up", "were now", ""],
    "found himself": ["caught himself", "realized he was", "was"],
    "found herself": ["caught herself", "realized she was", "was"],
    "a mixture of": ["both", "a blend of", ""],
    "mixture of": ["blend of", "combination of", ""],
    "let out a breath": ["exhaled", "breathed out", "sighed"],
    "released a breath": ["exhaled", "breathed out", "let go"],
    "breath he didn't know": ["breath he'd held", "breath he'd been holding"],
    "breath she didn't know": ["breath she'd held", "breath she'd been holding"],
    
    // Kissing clichés  
    "claimed his lips": ["kissed him", "pressed lips to his", "met his lips"],
    "claimed her lips": ["kissed her", "pressed lips to hers", "met her lips"],
    "crashed his lips": ["kissed him hard", "pressed against his lips"],
    "crashed her lips": ["kissed her hard", "pressed against her lips"],
    "drinking in": ["taking in", "absorbing", "savoring"],
    
    // ===== RUSSIAN =====
    
    // Звуки/голос
    "прорычал": ["процедил", "произнёс низко", "выдохнул", "сказал хрипло", "буркнул"],
    "прорычала": ["процедила", "произнесла низко", "выдохнула", "сказала хрипло"],
    "зарычал": ["произнёс низко", "процедил", "выдохнул резко"],
    "зарычала": ["произнесла низко", "процедила", "выдохнула резко"],
    "промурлыкал": ["протянул", "сказал мягко", "произнёс лениво"],
    "промурлыкала": ["протянула", "сказала мягко", "произнесла лениво"],
    "прошипел": ["процедил", "выдавил", "сказал сквозь зубы"],
    "прошипела": ["процедила", "выдавила", "сказала сквозь зубы"],
    "проурчал": ["пробормотал", "произнёс низко", "сказал тихо"],
    "проурчала": ["пробормотала", "произнесла низко", "сказала тихо"],
    
    // Хищное
    "хищный взгляд": ["острый взгляд", "тяжёлый взгляд", "цепкий взгляд", "пристальный взгляд"],
    "хищным взглядом": ["острым взглядом", "тяжёлым взглядом", "цепким взглядом"],
    "хищная улыбка": ["острая улыбка", "резкая улыбка", "недобрая улыбка", "холодная улыбка"],
    "хищной улыбкой": ["острой улыбкой", "резкой улыбкой", "холодной улыбкой"],
    "хищно улыбнулся": ["усмехнулся", "улыбнулся краем губ", "ухмыльнулся"],
    "хищно улыбнулась": ["усмехнулась", "улыбнулась краем губ", "ухмыльнулась"],
    "хищно": ["резко", "остро", "жёстко"],
    
    // Тело
    "плоть": ["кожа", "тело"],
    "плоти": ["кожи", "тела"],
    "плотью": ["кожей", "телом"],
    
    // Мурашки/напряжение
    "мурашки по спине": ["холодок по коже", "дрожь по телу", "озноб"],
    "мурашки побежали": ["холодок пробежал", "дрожь прошла", "озноб пробрал"],
    "мурашки пробежали": ["холодок пробежал", "дрожь прошла"],
    "мурашки по коже": ["холодок по телу", "дрожь по коже"],
    "напряжение в воздухе": ["тяжёлая тишина", "густая тишина", "давящее молчание"],
    "напряжение повисло": ["тишина повисла", "молчание затянулось"],
    "повисло в воздухе": ["осталось между ними", "повисло молчание", "затянулась пауза"],
    "висело в воздухе": ["ощущалось между ними", "давило тишиной"],
    "тяжело повисло": ["ощущалось", "давило"],
    "повисла тишина": ["стало тихо", "наступило молчание", "всё затихло"],
    "звенящая тишина": ["плотная тишина", "густая тишина", "полная тишина"],
    "оглушающая тишина": ["давящая тишина", "тяжёлая тишина", "мёртвая тишина"],
    "оглушительная тишина": ["полная тишина", "абсолютная тишина"],
    
    // Запахи
    "запах озона": ["резкий запах", "свежий запах", "запах грозы"],
    "озоном": ["свежестью", "грозой"],
    "озона": ["электричества", "грозы"],
    "мускус": ["тёплый запах", "его запах", "знакомый запах"],
    "мускусный": ["терпкий", "тёплый", "густой"],
    "мускусом": ["теплом", "его запахом"],
    "мускуса": ["тепла", "его запаха"],
    "сандал": ["дерево", "древесный аромат"],
    "сандала": ["дерева", "древесины"],
    "сандалом": ["деревом", "древесиной"],
    
    // Голос
    "бархатный голос": ["низкий голос", "мягкий голос", "глубокий голос", "тихий голос"],
    "бархатным голосом": ["низким голосом", "мягким голосом", "глубоким голосом"],
    "бархатистый голос": ["мягкий голос", "тёплый голос", "спокойный голос"],
    "бархатистым голосом": ["мягким голосом", "тёплым голосом"],
    
    // Собственничество
    "ты моя": ["я хочу тебя", "ты со мной", "ты рядом"],
    "ты мой": ["я хочу тебя", "ты со мной", "ты рядом"],
    "ты принадлежишь мне": ["ты нужна мне", "я хочу тебя", "останься"],
    "принадлежишь мне": ["нужна мне", "со мной", "останься"],
    "моя и только моя": ["только со мной", "только для меня", "моя"],
    "мой и только мой": ["только со мной", "только для меня", "мой"],
    
    // Клише-фразы
    "якорь": ["опора", "точка опоры"],
    "якорем": ["опорой", "поддержкой"],
    "якоря": ["опоры", "поддержки"],
    "капитуляция": ["сдача", "уступка", "поражение"],
    "капитулировал": ["сдался", "уступил", "отступил"],
    "капитулировала": ["сдалась", "уступила", "отступила"],
    "что-то другое": ["нечто", "что-то ещё", "иное"],
    "что-то иное": ["нечто", "другое"],
    "смесь из": ["сочетание", "переплетение"],
    "коктейль из": ["смешение", "сочетание", "переплетение"],
    "коктейль эмоций": ["волна эмоций", "буря чувств", "вихрь эмоций"],
    "не мог не": ["просто", "невольно", ""],
    "не могла не": ["просто", "невольно", ""],
    "не смог не": ["невольно", "всё же", ""],
    "не смогла не": ["невольно", "всё же", ""],
    
    // Поцелуи
    "накрыл губы": ["поцеловал", "прижался губами", "коснулся губ"],
    
    // Звериное (для людей - клише)
    "звериного": ["грубого", "животного", "первобытного", "сырого"],
    "звериное": ["грубое", "животное", "первобытное", "сырое"],
    "зверя": ["себя", "это", "что-то тёмное", "голод"],
    "разбудила зверя": ["перешла черту", "разбудила меня", "сама виновата"],
    "разбудил зверя": ["перешёл черту", "разбудил это", "сам виноват"],
    "по-звериному": ["грубо", "жёстко", "резко"],
    
    // Рычание вариации
    "рычал": ["говорил низко", "цедил", "выдыхал хрипло"],
    "рыча": ["цедя сквозь зубы", "говоря низко"],
    "рычание": ["низкий звук", "хриплый выдох"],
    "зарычав": ["выдохнув", "процедив"],
    
    // Запахи клише
    "смешанный с ароматом": ["и запах", "с нотой", "с примесью"],
    "смешанный с запахом": ["и", "вперемешку с", "с примесью"],
    "ударил в ноздри": ["накрыл", "окутал", "заполнил"],
    "ударил в нос": ["почувствовался", "накрыл", "дошёл"],
    "щекотал ноздри": ["чувствовался", "ощущался"],
    "сносил крышу": ["сводил с ума", "туманил голову", "кружил голову"],
    "снося крышу": ["сводя с ума", "затуманивая голову"],
    "снесло крышу": ["повело", "затуманило", "накрыло"],
    
    // Пульсация
    "пульсирует жилка": ["бьётся пульс", "видно пульс", "дёргается венка"],
    "пульсировала жилка": ["билась венка", "был виден пульс"],
    "пульсирующая жилка": ["венка", "пульс"],
    
    // Каменный (для тела)
    "каменным стержнем": ["твёрдым", "вставшим членом", "стояком"],
    "каменный стержень": ["стояк", "твёрдый член", "эрекция"],
    "каменной твердости": ["твёрдый", "полностью вставший"],
    "окаменел": ["напрягся", "встал", "затвердел"],
    "окаменевший": ["твёрдый", "напряжённый", "вставший"],
    
    // Ещё частые клише
    "впились в": ["сжали", "стиснули", "вцепились в"],
    "впился в": ["сжал", "стиснул", "вцепился в"],
    "впилась в": ["сжала", "стиснула", "вцепилась в"],
    "жестко фиксируя": ["удерживая", "держа", "не давая двигаться"],
    "жёстко фиксируя": ["удерживая", "держа крепко"],
    "вибрирующего": ["дрожащего", "срывающегося", "хриплого"],
    "вибрирующий": ["дрожащий", "срывающийся", "хриплый"],
    "вибрируя": ["дрожа", "срываясь"],
    "накрыла губы": ["поцеловала", "прижалась губами", "коснулась губ"],
    "накрыть губы": ["поцеловать", "прижаться губами"],
    "впился в губы": ["поцеловал жёстко", "поцеловал жадно", "прижался к губам"],
    "впилась в губы": ["поцеловала жёстко", "поцеловала жадно", "прижалась к губам"],
    "завладел губами": ["поцеловал", "накрыл рот поцелуем"],
    "завладела губами": ["поцеловала", "накрыла рот поцелуем"],
};

// Detect language of phrase
function detectLang(phrase) {
    return /[а-яёА-ЯЁ]/.test(phrase) ? 'ru' : 'en';
}

// Build banned items from smart database
function buildBannedItems() {
    const items = [];
    for (const [phrase, replacements] of Object.entries(smartDatabase)) {
        items.push({
            phrase: phrase,
            replacements: replacements, // Array of options
            enabled: true,
            lang: detectLang(phrase)
        });
    }
    return items;
}

// Default settings
const defaultSettings = {
    enabled: true,
    bannedItems: buildBannedItems(),
    showNotifications: true,
    notificationStyle: "toast",
    caseSensitive: false,
    filterLang: "all",
    useAiRewrite: false, // AI-powered smart rewrite
    aiRewriteThreshold: 3, // Use AI if more than X clichés found
};

// Stats
let sessionStats = {
    totalReplacements: 0,
    phrasesReplaced: {},
};

// Initialize
function loadSettings() {
    extension_settings[extensionName] = extension_settings[extensionName] || {};
    
    for (const [key, value] of Object.entries(defaultSettings)) {
        if (extension_settings[extensionName][key] === undefined) {
            extension_settings[extensionName][key] = JSON.parse(JSON.stringify(value));
        }
    }
    
    // Merge new phrases from database that might not exist in saved settings
    const savedPhrases = new Set(extension_settings[extensionName].bannedItems.map(i => i.phrase.toLowerCase()));
    for (const [phrase, replacements] of Object.entries(smartDatabase)) {
        if (!savedPhrases.has(phrase.toLowerCase())) {
            extension_settings[extensionName].bannedItems.push({
                phrase,
                replacements,
                enabled: true,
                lang: detectLang(phrase)
            });
        }
    }
}

function getSettings() {
    return extension_settings[extensionName];
}

// Pick random replacement
function pickReplacement(item) {
    const options = item.replacements || [item.replacement];
    if (!options || options.length === 0) return "";
    return options[Math.floor(Math.random() * options.length)];
}

// Word boundaries for different languages
function getRegex(phrase, lang, caseSensitive) {
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const flags = caseSensitive ? 'g' : 'gi';
    
    if (lang === 'ru') {
        return new RegExp(`(?<![а-яёА-ЯЁ])${escaped}(?![а-яёА-ЯЁ])`, flags);
    } else {
        return new RegExp(`(?<![a-zA-Z])${escaped}(?![a-zA-Z])`, flags);
    }
}

// Main processing function
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
        
        const regex = getRegex(item.phrase, item.lang, caseSensitive);
        const matches = processedText.match(regex);
        
        if (matches && matches.length > 0) {
            // Replace each match with potentially different random replacement
            for (const match of matches) {
                const replacement = pickReplacement(item);
                processedText = processedText.replace(match, replacement);
                totalCount++;
                
                sessionStats.totalReplacements++;
                sessionStats.phrasesReplaced[item.phrase] = (sessionStats.phrasesReplaced[item.phrase] || 0) + 1;
            }
            
            details.push({ 
                phrase: item.phrase, 
                options: item.replacements,
                count: matches.length 
            });
        }
    }
    
    return { text: processedText, count: totalCount, details };
}

// AI-powered rewrite (optional)
async function aiRewrite(text, clicheCount) {
    if (!getSettings().useAiRewrite) return text;
    if (clicheCount < getSettings().aiRewriteThreshold) return text;
    
    try {
        const prompt = `Rewrite this text to remove clichés and purple prose. Keep the same meaning but use more natural, less repetitive language. Only output the rewritten text, nothing else:

"${text}"`;
        
        const result = await generateQuietPrompt(prompt, false);
        return result || text;
    } catch (e) {
        console.warn('[Cliché Killer] AI rewrite failed:', e);
        return text;
    }
}

// Show notification
function notify(count, details) {
    if (!getSettings().showNotifications || count === 0) return;
    
    const style = getSettings().notificationStyle;
    const message = `Cliché Killer: ${count} fixed`;
    
    if (style === "toast" && typeof toastr !== 'undefined') {
        const detailText = details.slice(0, 5).map(d => 
            `"${d.phrase}" (${d.count})`
        ).join(', ');
        toastr.info(detailText, message, { timeOut: 3000 });
    } else {
        console.log(`[Cliché Killer] ${message}`, details);
    }
}

// Event handler
async function onMessageReceived(data) {
    if (!getSettings().enabled) return;
    if (!data.message) return;
    
    const result = processText(data.message);
    
    if (result.count > 0) {
        // Optional AI rewrite for heavy cliché messages
        data.message = await aiRewrite(result.text, result.count);
        notify(result.count, result.details);
    }
}

// Add custom phrase
function addPhrase(phrase, replacements, lang = null) {
    if (!phrase || !phrase.trim()) return false;
    
    const detectedLang = lang || detectLang(phrase);
    const replacementArray = Array.isArray(replacements) ? replacements : [replacements].filter(Boolean);
    
    const newItem = {
        phrase: phrase.trim(),
        replacements: replacementArray,
        enabled: true,
        lang: detectedLang
    };
    
    // Check duplicate
    const exists = getSettings().bannedItems.some(i => 
        i.phrase.toLowerCase() === newItem.phrase.toLowerCase()
    );
    if (exists) {
        toastr.warning(`"${phrase}" already exists`);
        return false;
    }
    
    getSettings().bannedItems.push(newItem);
    saveSettingsDebounced();
    return true;
}

// Remove phrase
function removePhrase(index) {
    getSettings().bannedItems.splice(index, 1);
    saveSettingsDebounced();
}

// Toggle phrase
function togglePhrase(index, enabled) {
    getSettings().bannedItems[index].enabled = enabled;
    saveSettingsDebounced();
}

// Export
function exportPhrases() {
    const data = JSON.stringify(getSettings().bannedItems, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cliche-killer-smart-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Import
function importPhrases(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                if (!Array.isArray(imported)) throw new Error("Invalid format");
                
                let added = 0;
                for (const item of imported) {
                    if (item.phrase) {
                        const exists = getSettings().bannedItems.some(i => 
                            i.phrase.toLowerCase() === item.phrase.toLowerCase()
                        );
                        if (!exists) {
                            getSettings().bannedItems.push({
                                phrase: item.phrase,
                                replacements: item.replacements || [item.replacement || ""],
                                enabled: item.enabled !== false,
                                lang: item.lang || detectLang(item.phrase)
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

// Reset
function resetToDefaults() {
    extension_settings[extensionName].bannedItems = buildBannedItems();
    saveSettingsDebounced();
}

// UI
function renderUI() {
    const html = `
    <div id="cliche-killer-panel">
        <div class="inline-drawer">
            <div class="inline-drawer-toggle inline-drawer-header">
                <b>🗡️ Cliché Killer Smart</b>
                <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
            </div>
            <div class="inline-drawer-content">
                
                <div class="ck-row">
                    <label class="checkbox_label">
                        <input type="checkbox" id="ck-enabled">
                        <span>Enable</span>
                    </label>
                </div>
                
                <div class="ck-stats">
                    🎯 Session: <span id="ck-stats-count">0</span> clichés killed
                </div>
                
                <hr>
                
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
                            <label>Language filter:</label>
                            <select id="ck-filter-lang">
                                <option value="all">All</option>
                                <option value="en">English</option>
                                <option value="ru">Русский</option>
                            </select>
                        </div>
                        
                        <hr>
                        
                        <div class="ck-row">
                            <label class="checkbox_label">
                                <input type="checkbox" id="ck-ai-rewrite">
                                <span>🤖 AI rewrite (experimental)</span>
                            </label>
                        </div>
                        <div class="ck-hint">Uses LLM to rewrite heavily clichéd text. Costs tokens.</div>
                        
                        <div class="ck-row" id="ck-ai-threshold-row">
                            <label>AI threshold: <span id="ck-threshold-value">3</span>+ clichés</label>
                            <input type="range" id="ck-ai-threshold" min="1" max="10" value="3">
                        </div>
                        
                    </div>
                </details>
                
                <hr>
                
                <details class="ck-section" open>
                    <summary>➕ Add Phrase</summary>
                    <div class="ck-section-content">
                        
                        <input type="text" id="ck-new-phrase" placeholder="Phrase to ban">
                        <input type="text" id="ck-new-replacements" placeholder="Replacements (comma-separated)">
                        <div class="ck-hint">e.g.: "low voice, deep voice, quiet voice"</div>
                        <button id="ck-add-btn" class="menu_button" style="margin-top:5px;">Add</button>
                        
                    </div>
                </details>
                
                <hr>
                
                <details class="ck-section">
                    <summary>📋 Database (<span id="ck-count">0</span>)</summary>
                    <div class="ck-section-content">
                        
                        <input type="text" id="ck-search" placeholder="Search...">
                        <div id="ck-phrase-list" class="ck-list"></div>
                        
                    </div>
                </details>
                
                <hr>
                
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
        #cliche-killer-panel .ck-row { margin: 8px 0; display: flex; align-items: center; gap: 8px; }
        #cliche-killer-panel .ck-stats { font-size: 12px; padding: 5px; background: rgba(100,200,100,0.1); border-radius: 4px; margin: 8px 0; }
        #cliche-killer-panel .ck-section { margin: 5px 0; }
        #cliche-killer-panel .ck-section summary { cursor: pointer; padding: 5px; font-weight: bold; }
        #cliche-killer-panel .ck-section-content { padding: 10px; background: rgba(100,100,100,0.05); border-radius: 4px; margin-top: 5px; }
        #cliche-killer-panel .ck-hint { font-size: 11px; opacity: 0.6; margin: 5px 0; }
        #cliche-killer-panel .ck-list { max-height: 350px; overflow-y: auto; border: 1px solid var(--SmartThemeBorderColor); border-radius: 4px; margin-top: 8px; }
        #cliche-killer-panel .ck-item { display: flex; align-items: flex-start; gap: 8px; padding: 6px 8px; border-bottom: 1px solid var(--SmartThemeBorderColor); font-size: 12px; }
        #cliche-killer-panel .ck-item:last-child { border-bottom: none; }
        #cliche-killer-panel .ck-item:hover { background: rgba(100,100,100,0.1); }
        #cliche-killer-panel .ck-item.disabled { opacity: 0.4; }
        #cliche-killer-panel .ck-item .phrase { font-weight: bold; min-width: 100px; }
        #cliche-killer-panel .ck-item .replacements { flex: 1; color: var(--SmartThemeQuoteColor); word-break: break-word; }
        #cliche-killer-panel .ck-item .lang-badge { font-size: 9px; padding: 1px 4px; border-radius: 3px; background: var(--SmartThemeBorderColor); }
        #cliche-killer-panel .ck-item .delete-btn { cursor: pointer; opacity: 0.5; }
        #cliche-killer-panel .ck-item .delete-btn:hover { opacity: 1; color: #ff6b6b; }
        #cliche-killer-panel .ck-buttons { display: flex; gap: 5px; flex-wrap: wrap; }
        #cliche-killer-panel .ck-buttons button { flex: 1; }
        #cliche-killer-panel input[type="text"] { width: 100%; margin: 3px 0; }
        #cliche-killer-panel hr { border: none; border-top: 1px solid var(--SmartThemeBorderColor); margin: 10px 0; }
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
    
    $('#ck-ai-rewrite').on('change', function() {
        getSettings().useAiRewrite = this.checked;
        saveSettingsDebounced();
        $('#ck-ai-threshold-row').toggle(this.checked);
    });
    
    $('#ck-ai-threshold').on('input', function() {
        getSettings().aiRewriteThreshold = parseInt(this.value);
        $('#ck-threshold-value').text(this.value);
        saveSettingsDebounced();
    });
    
    $('#ck-add-btn').on('click', function() {
        const phrase = $('#ck-new-phrase').val().trim();
        const replacementsStr = $('#ck-new-replacements').val().trim();
        const replacements = replacementsStr.split(',').map(s => s.trim()).filter(Boolean);
        
        if (addPhrase(phrase, replacements)) {
            $('#ck-new-phrase').val('');
            $('#ck-new-replacements').val('');
            renderPhraseList();
            toastr.success(`Added: "${phrase}" → [${replacements.length} variants]`);
        }
    });
    
    $('#ck-new-phrase, #ck-new-replacements').on('keypress', function(e) {
        if (e.key === 'Enter') $('#ck-add-btn').click();
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
                toastr.success(`Imported ${count} phrases`);
                renderPhraseList();
            } catch (err) {
                toastr.error('Import failed');
            }
            this.value = '';
        }
    });
    
    $('#ck-reset-btn').on('click', function() {
        if (confirm('Reset to defaults?')) {
            resetToDefaults();
            renderPhraseList();
            toastr.info('Reset complete');
        }
    });
}

function updateUI() {
    const s = getSettings();
    $('#ck-enabled').prop('checked', s.enabled);
    $('#ck-notifications').prop('checked', s.showNotifications);
    $('#ck-filter-lang').val(s.filterLang);
    $('#ck-ai-rewrite').prop('checked', s.useAiRewrite);
    $('#ck-ai-threshold').val(s.aiRewriteThreshold);
    $('#ck-threshold-value').text(s.aiRewriteThreshold);
    $('#ck-ai-threshold-row').toggle(s.useAiRewrite);
    $('#ck-stats-count').text(sessionStats.totalReplacements);
    renderPhraseList();
}

function renderPhraseList(search = '') {
    const list = $('#ck-phrase-list');
    const items = getSettings().bannedItems;
    const filterLang = getSettings().filterLang;
    const searchLower = search.toLowerCase();
    
    list.empty();
    
    let count = 0;
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        
        if (filterLang !== 'all' && item.lang !== filterLang) continue;
        if (searchLower && !item.phrase.toLowerCase().includes(searchLower)) continue;
        
        count++;
        const replacements = (item.replacements || []).join(', ') || '(delete)';
        
        const html = `
            <div class="ck-item ${item.enabled ? '' : 'disabled'}" data-index="${i}">
                <input type="checkbox" class="ck-toggle" ${item.enabled ? 'checked' : ''}>
                <span class="phrase">${escapeHtml(item.phrase)}</span>
                <span class="replacements">→ ${escapeHtml(replacements)}</span>
                <span class="lang-badge">${item.lang}</span>
                <span class="delete-btn fa-solid fa-xmark"></span>
            </div>
        `;
        list.append(html);
    }
    
    $('#ck-count').text(`${items.filter(i => i.enabled).length}/${items.length}`);
    
    list.find('.ck-toggle').on('change', function() {
        const idx = $(this).closest('.ck-item').data('index');
        togglePhrase(idx, this.checked);
        $(this).closest('.ck-item').toggleClass('disabled', !this.checked);
    });
    
    list.find('.delete-btn').on('click', function() {
        const idx = $(this).closest('.ck-item').data('index');
        removePhrase(idx);
        renderPhraseList($('#ck-search').val());
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

// Init
jQuery(async () => {
    loadSettings();
    renderUI();
    eventSource.on(event_types.MESSAGE_RECEIVED, onMessageReceived);
    console.log('[Cliché Killer] Smart v3.0 loaded');
});

// Public API
window.ClicheKiller = {
    addPhrase,
    removePhrase,
    processText,
    getStats: () => sessionStats,
    resetStats: () => { sessionStats = { totalReplacements: 0, phrasesReplaced: {} }; },
    getDatabase: () => smartDatabase,
};
