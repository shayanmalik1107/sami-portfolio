import re

with open('style.css', 'r') as f:
    css = f.read()

old_css = """/* Process Visual Stage Elements */
.process-visual {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  background: rgba(14, 13, 18, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.process-visual.raw { display: flex; flex-direction: row; gap: 12px; align-items: center; }
.process-visual .clip {
  background: rgba(224, 38, 63, 0.15);
  border: 1px solid var(--red);
  color: var(--white);
  padding: 18px 24px;
  border-radius: 8px;
  font: 700 16px var(--mono);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  transition: transform 0.3s ease;
}
.process-visual .clip:hover { transform: translateY(-4px) scale(1.05); }

.process-visual.structure { display: flex; flex-direction: column; gap: 12px; width: 100%; }
.sequence-row { display: flex; gap: 8px; height: 24px; width: 100%; }
.sequence-row i { flex: 1; background: rgba(255, 255, 255, 0.1); border-radius: 4px; }

.sound-wave { display: flex; align-items: center; gap: 4px; height: 80px; width: 100%; justify-content: center; margin-bottom: 20px; }
.wave { width: 4px; height: var(--h, 30%); background: var(--red); border-radius: 2px; transition: height 0.1s ease; }
.sound-preview { background: rgba(255, 255, 255, 0.1); color: var(--white); border: 1px solid rgba(255, 255, 255, 0.2); padding: 12px 24px; border-radius: 30px; font: 700 13px var(--mono); cursor: pointer; transition: all 0.3s ease; }
.sound-preview:hover { background: var(--red); border-color: var(--red); transform: translateY(-2px); }
.sound-preview.playing { background: var(--red); border-color: var(--red); box-shadow: 0 0 20px rgba(224, 38, 63, 0.4); }

.motion-demo { text-align: center; }
.motion-word { font: 800 48px var(--heading); color: var(--white); letter-spacing: -1px; margin-bottom: 20px; }
.motion-keyframes { display: flex; gap: 20px; justify-content: center; margin: 20px 0; }
.motion-keyframes i { width: 14px; height: 14px; background: var(--red); transform: rotate(45deg); display: inline-block; box-shadow: 0 0 10px rgba(224, 38, 63, 0.5); }

.process-visual.color { display: flex; flex-direction: column; gap: 16px; width: 100%; }
.palette-row { display: flex; align-items: center; gap: 16px; width: 100%; }
.palette-row .mono { width: 90px; font-size: 12px; color: var(--dim); }
.swatches { display: flex; gap: 8px; flex: 1; }
.swatches div { flex: 1; height: 36px; border-radius: 6px; }

.export-wrap { text-align: center; width: 100%; }
.export-wrap .label { font-size: 14px; color: var(--dim); margin-bottom: 16px; }
.export-progress-bar { width: 100%; height: 6px; background: rgba(255, 255, 255, 0.1); border-radius: 3px; overflow: hidden; margin-bottom: 16px; }
.export-progress-bar .fill { width: 100%; height: 100%; background: var(--red); animation: exportLoad 3s ease-in-out infinite; transform-origin: left; }
.export-wrap .status { font-size: 14px; color: var(--red); font-weight: 700; }

@keyframes exportLoad { 0% { transform: scaleX(0); } 100% { transform: scaleX(1); } }
"""

# Try to find the block
css = re.sub(r'/\* Process Visual Stage Elements \*/.*?@keyframes exportLoad \{[^\}]*\}', old_css, css, flags=re.DOTALL)

with open('style.css', 'w') as f:
    f.write(css)
