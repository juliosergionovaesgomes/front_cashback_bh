import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Shield, LogOut, Download, Search, Users, FileSpreadsheet, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";

interface Submission {
  id: string;
  full_name: string;
  email: string;
  steam_id: string;
  game_nickname: string;
  phone: string | null;
  pix_key: string;
  amount: number;
  status: string;
  notes: string | null;
  created_at: string;
}

export default function Dashboard() {
  return (<><div>Dashboard</div></>)
}
