"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { InputGroup } from "@/components/ui/InputGroup";
import { Settings, Lock, Trash2, Download, Eye, EyeOff } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearData: () => void;
  onExportReport: () => void;
}

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  onClearData, 
  onExportReport 
}: SettingsModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  if (!isOpen) return null;

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setIsChangingPassword(true);

    if (newPassword !== confirmPassword) {
      setPasswordError("新密码与确认密码不一致");
      setIsChangingPassword(false);
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("新密码至少需要6个字符");
      setIsChangingPassword(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '密码修改失败');
      }

      alert("密码修改成功！");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      setPasswordError(error.message || '密码修改失败，请重试');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleClearData = () => {
    if (confirm("确定要清除所有统计数据吗？此操作不可撤销。")) {
      onClearData();
      onClose();
    }
  };

  const handleExportReport = () => {
    onExportReport();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Settings className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>系统设置</CardTitle>
              <CardDescription>管理后台配置选项</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 修改密码 */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Lock className="h-4 w-4" />
              修改管理员密码
            </h3>
            <form onSubmit={handleChangePassword} className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm">当前密码</label>
                <div className="relative">
                  <InputGroup
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={setCurrentPassword}
                    placeholder="输入当前密码"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm">新密码</label>
                <div className="relative">
                  <InputGroup
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={setNewPassword}
                    placeholder="输入新密码"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm">确认新密码</label>
                <div className="relative">
                  <InputGroup
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    placeholder="再次输入新密码"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              {passwordError && (
                <p className="text-sm text-destructive">{passwordError}</p>
              )}
              <Button type="submit" className="w-full" disabled={isChangingPassword}>
                {isChangingPassword ? '更新中...' : '更新密码'}
              </Button>
            </form>
          </div>

          {/* 数据管理 */}
          <div className="space-y-4">
            <h3 className="font-medium">数据管理</h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleExportReport}
              >
                <Download className="mr-2 h-4 w-4" />
                导出完整报告 (CSV)
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={handleClearData}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                清除所有统计数据
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              注意：清除数据将删除所有事件记录，此操作不可撤销。
            </p>
          </div>

          {/* 关闭按钮 */}
          <div className="pt-4 border-t border-border">
            <Button variant="outline" className="w-full" onClick={onClose}>
              关闭设置
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}